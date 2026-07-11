-- ============================================================
-- Fix: participant-initiated connection requests were invisible
-- ============================================================
-- When a participant clicked "Connect" on someone's profile, the client
-- inserted a row into public.connections. But the only INSERT policy on that
-- table ("System can insert connections") required the caller to be a
-- facilitator, so the row was silently rejected by RLS and never persisted —
-- neither the sender nor the recipient ever saw the request in their
-- connections list.
--
-- Allow a participant to create a connection they are part of. Facilitators
-- keep the ability to pre-create connections when they approve a match.

drop policy if exists "System can insert connections" on public.connections;

create policy "Participants and facilitators can create connections"
  on public.connections for insert
  with check (
    auth.uid() = participant_a_id
    or auth.uid() = participant_b_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

-- Notifying the *other* person was blocked the same way. The single "for all"
-- policy on notifications used `auth.uid() = user_id`, which PostgREST also
-- applies as the INSERT check — so a user could never create a notification
-- addressed to anyone but themselves (connect requests, new-message and
-- meeting alerts, and the facilitator's match-approved notices all failed).
--
-- Split the policy: owners still fully control their own notifications, while
-- any authenticated user may deliver one to someone else.

drop policy if exists "Users can manage own notifications" on public.notifications;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

create policy "Authenticated users can send notifications"
  on public.notifications for insert
  with check (auth.uid() is not null);
