-- Add age column to profiles table
alter table public.profiles
add column if not exists age integer;

-- Add check constraint for reasonable age range
alter table public.profiles
add constraint profiles_age_check check (age is null or (age >= 13 and age <= 120));