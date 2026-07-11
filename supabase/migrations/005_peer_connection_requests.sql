-- ============================================================
-- Peer-to-peer connection requests
-- ============================================================
-- Participants can now send a connection request directly to anyone, instead
-- of only being able to act on a facilitator-approved match. Such a request
-- has no underlying match row, so match_id must be optional.

alter table public.connections alter column match_id drop not null;

-- A requester can withdraw a request that hasn't been mutually accepted yet.
create policy "Participants can delete own pending connections"
  on public.connections for delete
  using (
    (auth.uid() = participant_a_id or auth.uid() = participant_b_id)
    and status = 'pending'
  );
