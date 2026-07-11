-- ============================================================
-- One-shot fix for peer connection requests (idempotent).
-- Paste this into the Supabase SQL Editor and run it.
-- Combines migrations 004 + 005; safe to run more than once.
-- ============================================================

-- Peer-to-peer requests have no facilitator match, so match_id is optional.
alter table public.connections alter column match_id drop not null;

-- A participant may create a connection they are part of (facilitators keep
-- their ability to pre-create connections when approving a match).
drop policy if exists "System can insert connections" on public.connections;
drop policy if exists "Participants and facilitators can create connections" on public.connections;
create policy "Participants and facilitators can create connections"
  on public.connections for insert
  with check (
    auth.uid() = participant_a_id
    or auth.uid() = participant_b_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'facilitator')
  );

-- A requester may withdraw a request that hasn't been mutually accepted yet.
drop policy if exists "Participants can delete own pending connections" on public.connections;
create policy "Participants can delete own pending connections"
  on public.connections for delete
  using (
    (auth.uid() = participant_a_id or auth.uid() = participant_b_id)
    and status = 'pending'
  );

-- Notifying the *other* person: owners still control their own notifications,
-- any authenticated user may deliver one.
drop policy if exists "Users can manage own notifications" on public.notifications;
drop policy if exists "Users can read own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Users can delete own notifications" on public.notifications;
drop policy if exists "Authenticated users can send notifications" on public.notifications;
create policy "Users can read own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications"
  on public.notifications for delete using (auth.uid() = user_id);
create policy "Authenticated users can send notifications"
  on public.notifications for insert with check (auth.uid() is not null);
