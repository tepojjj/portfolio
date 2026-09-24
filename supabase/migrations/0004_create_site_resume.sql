-- Site resume (single row) + Row Level Security
-- Powers both the "View Resume" page at /resume and the admin panel's
-- Resume tab, where the content is edited and a PDF can be generated.
-- Note: the `experience` column seeded below is removed by migration 0005,
-- which switches the resume's Experience section to sync live from the
-- `experience` table instead. Run migrations in order.
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you use the Supabase CLI.
-- Requires 0001_create_projects.sql to have run first (reuses the
-- public.set_updated_at() trigger function it defines).

create table if not exists public.site_resume (
  id smallint primary key default 1,
  full_name text not null default '',
  title text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  linkedin text not null default '',
  summary text not null default '',
  skills text[] not null default '{}',
  experience jsonb not null default '[]',
  education jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  constraint site_resume_singleton check (id = 1)
);

-- Keep updated_at current on every edit.
drop trigger if exists site_resume_set_updated_at on public.site_resume;
create trigger site_resume_set_updated_at
  before update on public.site_resume
  for each row execute function public.set_updated_at();

-- Seed the single row so the admin panel and /resume page have something to
-- load and edit. Replace these with your real resume from the admin panel.
insert into public.site_resume
  (id, full_name, title, email, phone, location, linkedin, summary, skills, experience, education)
values (
  1,
  'Jopet Pallarcon',
  'Web Developer / Data Analyst / Automation Enthusiast',
  'hello@jet-dev.com',
  '+63 900 000 0000',
  'Philippines',
  'linkedin.com/in/jet-dev',
  'Web developer and data analyst who builds automation systems that turn complex operations into simple, reliable products. Comfortable across the stack, from React front ends to backend APIs and spreadsheet-based automation.',
  array['React', 'TypeScript', 'Python', 'Node.js / Express', 'Lark Base', 'Google Apps Script', 'Data Analysis', 'Process Automation'],
  '[
    {
      "position": "Web Developer & Operations Systems Lead",
      "company": "UBEST",
      "date": "Present",
      "bullets": [
        "Manage inventory data, store data, and internal tooling across approximately 65 stores",
        "Build and maintain React web apps and backend APIs for warehouse and retail operations",
        "Design formulas and automation inside the Lark/Feishu Base ecosystem",
        "Reconcile inventory data between Lark Base and Excel master files",
        "Automated floor and zone assignment for approximately 62,000 product rows across 64 stores",
        "Replaced manual reconciliation and reporting workflows with self-serve tools"
      ]
    }
  ]'::jsonb,
  '[
    {
      "degree": "Add your degree",
      "school": "Add your school",
      "date": "Add dates",
      "details": "Add your field of study, honors, or relevant coursework — or remove this entry if not applicable."
    }
  ]'::jsonb
)
on conflict (id) do nothing;

alter table public.site_resume enable row level security;

-- Anyone (including anonymous site visitors) can read the resume — the
-- public /resume page needs this.
drop policy if exists "Public read access" on public.site_resume;
create policy "Public read access"
  on public.site_resume for select
  to anon, authenticated
  using (true);

-- Only logged-in users (i.e. you) can update it.
drop policy if exists "Authenticated update" on public.site_resume;
create policy "Authenticated update"
  on public.site_resume for update
  to authenticated
  using (true)
  with check (true);

-- Allowed too, in case the seed row above didn't get created for some reason
-- and the admin panel needs to insert it on first save.
drop policy if exists "Authenticated insert" on public.site_resume;
create policy "Authenticated insert"
  on public.site_resume for insert
  to authenticated
  with check (true);

-- Data API grants (required for new tables from Oct 30, 2026: Supabase no
-- longer auto-grants access). RLS policies above still decide which rows.
grant select on public.site_resume to anon;
grant select, insert, update on public.site_resume to authenticated;
grant all on public.site_resume to service_role;
