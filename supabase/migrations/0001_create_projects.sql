-- Portfolio projects table + Row Level Security
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you use the Supabase CLI.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  image text not null default '',
  tech text[] not null default '{}',
  features text[] not null default '{}',
  problem text not null default '',
  solution text not null default '',
  architecture text not null default '',
  challenges text not null default '',
  results text not null default '',
  github text,
  demo text,
  accent text not null default 'teal' check (accent in ('teal', 'amber')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

-- Anyone (including anonymous site visitors) can read projects.
drop policy if exists "Public read access" on public.projects;
create policy "Public read access"
  on public.projects for select
  to anon, authenticated
  using (true);

-- Only logged-in users (i.e. you, once you create your admin account)
-- can add, edit, or delete projects.
drop policy if exists "Authenticated insert" on public.projects;
create policy "Authenticated insert"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update" on public.projects;
create policy "Authenticated update"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete" on public.projects;
create policy "Authenticated delete"
  on public.projects for delete
  to authenticated
  using (true);

create index if not exists projects_sort_order_idx on public.projects (sort_order, created_at);
