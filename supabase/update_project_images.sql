-- Run this in the Supabase SQL Editor to point existing project rows at the
-- new card background images. Only needed if your `projects` table already
-- has rows (e.g. from an earlier seed or the admin panel) — new seeds from
-- supabase/seed.sql already include these paths.
--
-- Upload the 5 files in public/project-images/ to a public location the site
-- can reach (e.g. commit them to the repo so they ship with the build, or
-- upload to Supabase Storage and swap the paths below for the storage URLs).

update public.projects set image = '/project-images/inventory-reconciliation.webp' where slug = 'inventory-reconciliation';
update public.projects set image = '/project-images/warehouse-ops-console.webp'     where slug = 'warehouse-ops-console';
update public.projects set image = '/project-images/retail-analytics.webp'          where slug = 'retail-analytics';
update public.projects set image = '/project-images/fuzzy-import.webp'              where slug = 'fuzzy-import';
update public.projects set image = '/project-images/inventory-classifier.webp'      where slug = 'inventory-classifier';

-- Mardams Job Order System — replace 'REPLACE_WITH_SLUG' with its actual
-- slug from the admin panel or the projects table (SELECT slug, name FROM
-- public.projects; to find it).
update public.projects set image = '/project-images/mardams-job-order.webp' where slug = 'REPLACE_WITH_SLUG';
