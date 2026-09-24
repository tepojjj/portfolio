-- Experience timeline table + Row Level Security
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you use the Supabase CLI.
-- Requires 0001_create_projects.sql to have run first (reuses the
-- public.set_updated_at() trigger function it defines).

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  date text not null default '',
  position text not null default '',
  company text not null default '',
  responsibilities text[] not null default '{}',
  tech text[] not null default '{}',
  achievements text[] not null default '{}',
  placeholder boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at
  before update on public.experience
  for each row execute function public.set_updated_at();

-- Seed with the entries that were previously hardcoded in
-- src/data/experience.ts, so the timeline isn't empty right after migrating.
insert into public.experience
  (date, position, company, responsibilities, tech, achievements, placeholder, sort_order)
values
  (
    'Present',
    'Web Developer & Operations Systems Lead',
    'UBEST',
    array[
      'Manage inventory data, store data, and internal tooling across ~65 stores',
      'Build and maintain React web apps and backend APIs for warehouse and retail operations',
      'Design formulas and automation inside the Lark/Feishu Base ecosystem',
      'Reconcile inventory data between Lark Base and Excel master files'
    ],
    array['React', 'Python', 'Lark Base', 'Google Apps Script', 'Express'],
    array[
      'Automated floor/zone assignment for ~62,000 product rows across 64 stores',
      'Replaced manual reconciliation and reporting workflows with self-serve tools'
    ],
    false,
    0
  )
on conflict do nothing;

alter table public.experience enable row level security;

-- Anyone (including anonymous site visitors) can read the experience timeline.
drop policy if exists "Public read access" on public.experience;
create policy "Public read access"
  on public.experience for select
  to anon, authenticated
  using (true);

-- Only logged-in users (i.e. you, once you create your admin account)
-- can add, edit, or delete timeline entries.
drop policy if exists "Authenticated insert" on public.experience;
create policy "Authenticated insert"
  on public.experience for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update" on public.experience;
create policy "Authenticated update"
  on public.experience for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete" on public.experience;
create policy "Authenticated delete"
  on public.experience for delete
  to authenticated
  using (true);

create index if not exists experience_sort_order_idx on public.experience (sort_order, created_at);

-- Data API grants (required for new tables from Oct 30, 2026: Supabase no
-- longer auto-grants access). RLS policies above still decide which rows.
grant select on public.experience to anon;
grant select, insert, update, delete on public.experience to authenticated;
grant all on public.experience to service_role;
