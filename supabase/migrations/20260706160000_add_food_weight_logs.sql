-- Food log: record what users actually ate (vs what was planned)
create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  log_date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name text not null,
  calories numeric(8,2) not null,
  protein_g numeric(8,2) not null default 0,
  carbs_g numeric(8,2) not null default 0,
  fat_g numeric(8,2) not null default 0,
  source text default 'manual',  -- 'manual' or 'plan'
  recipe_id integer,  -- null for manual entries
  created_at timestamptz not null default now()
);

create index if not exists idx_food_logs_profile_date
  on public.food_logs(profile_id, log_date desc);

grant select, insert, update, delete on public.food_logs to authenticated;
alter table public.food_logs enable row level security;

create policy "food_logs_select_own"
  on public.food_logs for select to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = food_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "food_logs_insert_own"
  on public.food_logs for insert to authenticated
  with check (exists (
    select 1 from public.profiles
    where profiles.id = food_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "food_logs_update_own"
  on public.food_logs for update to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = food_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "food_logs_delete_own"
  on public.food_logs for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = food_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

-- Weight tracking for trend charts
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  log_date date not null,
  weight_kg numeric(5,2) not null,
  note text,
  created_at timestamptz not null default now(),
  unique (profile_id, log_date)
);

create index if not exists idx_weight_logs_profile_date
  on public.weight_logs(profile_id, log_date desc);

grant select, insert, update, delete on public.weight_logs to authenticated;
alter table public.weight_logs enable row level security;

create policy "weight_logs_select_own"
  on public.weight_logs for select to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = weight_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "weight_logs_insert_own"
  on public.weight_logs for insert to authenticated
  with check (exists (
    select 1 from public.profiles
    where profiles.id = weight_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "weight_logs_update_own"
  on public.weight_logs for update to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = weight_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create policy "weight_logs_delete_own"
  on public.weight_logs for delete to authenticated
  using (exists (
    select 1 from public.profiles
    where profiles.id = weight_logs.profile_id
      and profiles.clerk_user_id = auth.jwt() ->> 'sub'
  ));
