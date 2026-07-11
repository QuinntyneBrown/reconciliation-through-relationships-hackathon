-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  bio text,
  additional_matching_info text,
  is_indigenous boolean,
  sex text check (sex in ('male', 'female', 'prefer_not_to_say')),
  participation_categories text[] default '{}',
  city text,
  province text,
  treaty_area text,
  faith_tradition text check (faith_tradition in (
    'indigenous_traditional', 'atheist', 'christian', 'jewish',
    'muslim', 'hindu', 'buddhist', 'other', 'prefer_not_to_say'
  )),
  faith_tradition_other text,
  interests text[] default '{}',
  availability jsonb default '{"days": [], "times": []}',
  participation_format text[] default '{}',
  language_preferences text[] default '{}',
  personal_boundaries text,
  matching_preferences jsonb default '{"weight_sex": false, "weight_interests": true, "weight_location": true}',
  role text not null default 'participant' check (role in ('participant', 'facilitator')),
  onboarding_completed boolean not null default false,
  learning_completed boolean not null default false,
  map_consent boolean not null default false,
  lat double precision,
  lng double precision,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view approved participants"
  on public.profiles for select
  using (
    auth.uid() = id
    or role = 'facilitator'
    or (learning_completed = true and onboarding_completed = true)
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profile created on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- LEARNING MODULES
-- ============================================================
create table public.learning_modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  content_type text not null check (content_type in ('video', 'text')),
  content_url text,
  content_body text,
  duration_minutes int default 5,
  order_index int not null,
  audience text not null check (audience in ('non_indigenous', 'indigenous', 'all')),
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.learning_modules enable row level security;

create policy "Anyone authenticated can view modules"
  on public.learning_modules for select
  using (auth.uid() is not null);

create policy "Facilitators can manage modules"
  on public.learning_modules for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- LEARNING PROGRESS
-- ============================================================
create table public.learning_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  time_spent_seconds int default 0,
  created_at timestamptz not null default now(),
  unique(user_id, module_id)
);

alter table public.learning_progress enable row level security;

create policy "Users can manage own progress"
  on public.learning_progress for all
  using (auth.uid() = user_id);

create policy "Facilitators can view all progress"
  on public.learning_progress for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- MATCHES
-- ============================================================
create table public.matches (
  id uuid primary key default uuid_generate_v4(),
  indigenous_participant_id uuid not null references public.profiles(id) on delete cascade,
  non_indigenous_participant_id uuid not null references public.profiles(id) on delete cascade,
  match_score numeric(5,2) check (match_score >= 0 and match_score <= 100),
  match_criteria jsonb default '{}',
  status text not null default 'suggested' check (status in ('suggested', 'approved', 'rejected', 'connected')),
  auto_generated boolean not null default false,
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "Participants can view their own matches"
  on public.matches for select
  using (
    auth.uid() = indigenous_participant_id
    or auth.uid() = non_indigenous_participant_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

create policy "Facilitators can manage all matches"
  on public.matches for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- CONNECTIONS
-- ============================================================
create table public.connections (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade,
  participant_a_id uuid not null references public.profiles(id) on delete cascade,
  participant_b_id uuid not null references public.profiles(id) on delete cascade,
  participant_a_connected boolean not null default false,
  participant_b_connected boolean not null default false,
  connected_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'active')),
  created_at timestamptz not null default now()
);

alter table public.connections enable row level security;

create policy "Participants can view own connections"
  on public.connections for select
  using (
    auth.uid() = participant_a_id
    or auth.uid() = participant_b_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

create policy "Participants can update own connection status"
  on public.connections for update
  using (
    auth.uid() = participant_a_id
    or auth.uid() = participant_b_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

create policy "System can insert connections"
  on public.connections for insert
  with check (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Connection participants can send and read messages"
  on public.messages for all
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
      and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid())
    )
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- MEETINGS
-- ============================================================
create table public.meetings (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  zoom_meeting_id text,
  zoom_join_url text,
  zoom_start_url text,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  topic text default 'RTR Connection Call',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.meetings enable row level security;

create policy "Connection participants can view and create meetings"
  on public.meetings for all
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
      and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid())
    )
    or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- COHORTS
-- ============================================================
create table public.cohorts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null,
  province text not null,
  facilitator_id uuid not null references public.profiles(id),
  status text not null default 'forming' check (status in ('forming', 'active')),
  created_at timestamptz not null default now()
);

alter table public.cohorts enable row level security;

create policy "Authenticated users can view cohorts"
  on public.cohorts for select
  using (auth.uid() is not null);

create policy "Facilitators can manage cohorts"
  on public.cohorts for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- COHORT MEMBERS
-- ============================================================
create table public.cohort_members (
  id uuid primary key default uuid_generate_v4(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  participant_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(cohort_id, participant_id)
);

alter table public.cohort_members enable row level security;

create policy "Authenticated users can view cohort members"
  on public.cohort_members for select
  using (auth.uid() is not null);

create policy "Facilitators can manage cohort members"
  on public.cohort_members for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );


-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================
create table public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.system_settings enable row level security;

create policy "Authenticated users can view settings"
  on public.system_settings for select
  using (auth.uid() is not null);

create policy "Facilitators can update settings"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'facilitator'
    )
  );

-- Default settings
insert into public.system_settings (key, value) values
  ('auto_matching_enabled', 'true'),
  ('cohort_threshold', '5');


-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('connect_request', 'match_approved', 'new_message', 'meeting_scheduled')),
  title text not null,
  body text,
  data jsonb default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can manage own notifications"
  on public.notifications for all
  using (auth.uid() = user_id);

-- Enable realtime for messages and notifications
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
