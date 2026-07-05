create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  name text not null,
  gender text not null check (gender in ('male', 'female')),
  age integer not null check (age between 10 and 100),
  height_cm numeric(5,2) not null check (height_cm between 100 and 250),
  weight_kg numeric(5,2) not null check (weight_kg between 30 and 250),
  body_fat_pct numeric(5,2),
  activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal text not null check (goal in ('lose_fat', 'maintain', 'gain_muscle')),
  diet_preference text,
  allergens jsonb not null default '[]'::jsonb,
  disliked_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_plan_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  plan_date date not null,
  target jsonb not null,
  meals jsonb not null,
  total_calories numeric(8,2) not null,
  total_protein_g numeric(8,2) not null,
  total_carbs_g numeric(8,2) not null,
  total_fat_g numeric(8,2) not null,
  created_at timestamptz not null default now(),
  unique (profile_id, plan_date)
);

create table if not exists public.grocery_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  grocery_date date not null,
  items jsonb not null,
  grouped_items jsonb not null,
  created_at timestamptz not null default now(),
  unique (profile_id, grocery_date)
);

create table if not exists public.coach_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null,
  title text not null,
  focus text not null check (focus in ('daily_review', 'meal_strategy', 'eating_out', 'cravings')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  structured_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_clerk_user_id
  on public.profiles(clerk_user_id);

create index if not exists idx_daily_plan_profile_date
  on public.daily_plan_snapshots(profile_id, plan_date desc);

create index if not exists idx_grocery_profile_date
  on public.grocery_snapshots(profile_id, grocery_date desc);

create index if not exists idx_coach_sessions_profile_updated
  on public.coach_sessions(profile_id, updated_at desc);

grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.daily_plan_snapshots to authenticated;
grant select, insert, update on public.grocery_snapshots to authenticated;
grant select, insert, update, delete on public.coach_sessions to authenticated;
grant select, insert, update, delete on public.coach_messages to authenticated;
grant select, insert, update on public.profiles to authenticated;

alter table public.profiles enable row level security;
alter table public.daily_plan_snapshots enable row level security;
alter table public.grocery_snapshots enable row level security;
alter table public.coach_sessions enable row level security;
alter table public.coach_messages enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub');

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create policy "daily_plan_select_own"
  on public.daily_plan_snapshots
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = daily_plan_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "daily_plan_insert_own"
  on public.daily_plan_snapshots
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = daily_plan_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "daily_plan_update_own"
  on public.daily_plan_snapshots
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = daily_plan_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = daily_plan_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "grocery_select_own"
  on public.grocery_snapshots
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = grocery_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "grocery_insert_own"
  on public.grocery_snapshots
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = grocery_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "grocery_update_own"
  on public.grocery_snapshots
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = grocery_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = grocery_snapshots.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_sessions_select_own"
  on public.coach_sessions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = coach_sessions.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_sessions_insert_own"
  on public.coach_sessions
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = coach_sessions.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_sessions_update_own"
  on public.coach_sessions
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = coach_sessions.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = coach_sessions.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_sessions_delete_own"
  on public.coach_sessions
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = coach_sessions.profile_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_messages_select_own"
  on public.coach_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.coach_sessions
      join public.profiles on profiles.id = coach_sessions.profile_id
      where coach_sessions.id = coach_messages.session_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_messages_insert_own"
  on public.coach_messages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.coach_sessions
      join public.profiles on profiles.id = coach_sessions.profile_id
      where coach_sessions.id = coach_messages.session_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_messages_update_own"
  on public.coach_messages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.coach_sessions
      join public.profiles on profiles.id = coach_sessions.profile_id
      where coach_sessions.id = coach_messages.session_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  with check (
    exists (
      select 1
      from public.coach_sessions
      join public.profiles on profiles.id = coach_sessions.profile_id
      where coach_sessions.id = coach_messages.session_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "coach_messages_delete_own"
  on public.coach_messages
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.coach_sessions
      join public.profiles on profiles.id = coach_sessions.profile_id
      where coach_sessions.id = coach_messages.session_id
        and profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );
