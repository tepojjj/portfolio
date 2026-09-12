-- Adds preview_urls: extra pages/tabs of a project's live site to cycle
-- through during the project-card hover preview. Falls back to just `demo`
-- when empty/null. Run in the Supabase SQL editor or via `supabase db push`.

alter table public.projects
  add column if not exists preview_urls text[];
