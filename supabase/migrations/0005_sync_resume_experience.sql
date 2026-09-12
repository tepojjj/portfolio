-- Resume Experience section now syncs live from the `experience` table
-- (added in 0003) instead of storing its own copy — a role only needs to be
-- entered once, in the Experience tab, and both the Experience section and
-- the Resume automatically reflect it.
--
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query),
-- or via `supabase db push` if you use the Supabase CLI.
-- Requires 0004_create_site_resume.sql to have run first.

alter table public.site_resume drop column if exists experience;
