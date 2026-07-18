-- Add the application-level administrator role used by the dedicated admin API.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('participant', 'facilitator', 'admin'));
