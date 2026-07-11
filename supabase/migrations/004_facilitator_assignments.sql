-- ============================================================
-- FACILITATOR ASSIGNMENTS
-- Pairs a participant with a facilitator (profiles.role). This is a distinct
-- relationship from `matches` (participant <-> participant), so it gets its own
-- table. Scored on interests, location, and gender (see
-- src/domain/facilitator-matching.ts).
-- ============================================================
create table public.facilitator_assignments (
  id uuid primary key default uuid_generate_v4(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  facilitator_id uuid not null references public.profiles(id) on delete cascade,
  match_score numeric(5,2) check (match_score >= 0 and match_score <= 100),
  match_criteria jsonb default '{}',
  status text not null default 'suggested' check (status in ('suggested', 'approved', 'rejected')),
  auto_generated boolean not null default false,
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique(participant_id, facilitator_id)
);

alter table public.facilitator_assignments enable row level security;

create policy "Users can view own facilitator assignments"
  on public.facilitator_assignments for select
  using (
    auth.uid() = participant_id
    or auth.uid() = facilitator_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

create policy "Facilitators can manage facilitator assignments"
  on public.facilitator_assignments for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

-- Auto-suggestion toggle (mirrors auto_matching_enabled for participant matches).
insert into public.system_settings (key, value) values
  ('auto_facilitator_matching_enabled', 'true')
  on conflict (key) do nothing;
