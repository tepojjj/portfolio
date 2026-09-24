-- Contact form submissions. Anyone can submit (insert); only you, once
-- signed in to the admin panel, can read/update/delete them. This is what
-- lets visitor messages actually be captured and reviewed, instead of the
-- old placeholder submit that just faked a success state client-side.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Site visitors (anonymous) can submit the contact form, but cannot read
-- back any row, including their own — this table is write-only for them.
drop policy if exists "Public insert access" on public.messages;
create policy "Public insert access"
  on public.messages for insert
  to anon, authenticated
  with check (true);

-- Only you (once logged into the admin panel) can view, mark read, or
-- delete messages.
drop policy if exists "Authenticated read access" on public.messages;
create policy "Authenticated read access"
  on public.messages for select
  to authenticated
  using (true);

drop policy if exists "Authenticated update" on public.messages;
create policy "Authenticated update"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete" on public.messages;
create policy "Authenticated delete"
  on public.messages for delete
  to authenticated
  using (true);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- Data API grants (required for new tables from Oct 30, 2026: Supabase no
-- longer auto-grants access). RLS policies above still decide which rows.
grant insert on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
