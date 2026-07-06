-- Add recipes table to Supabase for persistent recipe storage

create table if not exists public.recipes (
  id integer primary key,
  name text not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  calories numeric(8,2) not null,
  protein_g numeric(8,2) not null,
  carbs_g numeric(8,2) not null,
  fat_g numeric(8,2) not null,
  tags jsonb not null default '[]'::jsonb,
  allergens jsonb not null default '[]'::jsonb,
  cook_minutes integer not null default 15,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  image_emoji text not null default '🍽️',
  created_at timestamptz not null default now()
);

create index if not exists idx_recipes_meal_type on public.recipes(meal_type);

-- Recipes are readable by everyone (anon + authenticated)
grant select on public.recipes to anon, authenticated;
alter table public.recipes enable row level security;

create policy "recipes_read_all"
  on public.recipes
  for select
  to anon, authenticated
  using (true);

-- Only service_role can insert/update/delete recipes (server-side seeding)
