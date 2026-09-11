-- Site contact info (single row) + Row Level Security
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you use the Supabase CLI.
-- Requires 0001_create_projects.sql to have run first (reuses the
-- public.set_updated_at() trigger function it defines).

create table if not exists public.site_contact (
  id smallint primary key default 1,
  email text not null default '',
  phone text not null default '',
  linkedin text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_contact_singleton check (id = 1)
);

-- Keep updated_at current on every edit.
drop trigger if exists site_contact_set_updated_at on public.site_contact;
create trigger site_contact_set_updated_at
  before update on public.site_contact
  for each row execute function public.set_updated_at();

-- Seed the single row so the admin panel has something to load and edit.
-- Replace these with your real details from the admin panel at /admin.
insert into public.site_contact (id, email, phone, linkedin)
values (1, 'hello@jet-dev.com', '+63 900 000 0000', 'linkedin.com/in/jet-dev')
on conflict (id) do nothing;

alter table public.site_contact enable row level security;

-- Anyone (including anonymous site visitors) can read the contact info.
drop policy if exists "Public read access" on public.site_contact;
create policy "Public read access"
  on public.site_contact for select
  to anon, authenticated
  using (true);

-- Only logged-in users (i.e. you) can update it.
drop policy if exists "Authenticated update" on public.site_contact;
create policy "Authenticated update"
  on public.site_contact for update
  to authenticated
  using (true)
  with check (true);

-- Allowed too, in case the seed row above didn't get created for some reason
-- and the admin panel needs to insert it on first save.
drop policy if exists "Authenticated insert" on public.site_contact;
create policy "Authenticated insert"
  on public.site_contact for insert
  to authenticated
  with check (true);
