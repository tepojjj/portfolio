-- Run this in the Supabase SQL Editor to swap the illustrated card icons for
-- real stock photos (sourced from Pexels, free to use, hotlinked from their
-- CDN — no need to upload anything).
--
-- Find your Mardams slug first if you don't know it:
--   SELECT slug, name FROM public.projects WHERE name ILIKE '%mardams%';

update public.projects set image = 'https://images.pexels.com/photos/4484154/pexels-photo-4484154.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'inventory-reconciliation';

update public.projects set image = 'https://images.pexels.com/photos/4483862/pexels-photo-4483862.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'warehouse-ops-console';

update public.projects set image = 'https://images.pexels.com/photos/20142114/pexels-photo-20142114/free-photo-of-financial-report-data-presentation-expense-and-cost-calculations.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'retail-analytics';

update public.projects set image = 'https://images.pexels.com/photos/5717779/pexels-photo-5717779.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'fuzzy-import';

update public.projects set image = 'https://images.pexels.com/photos/4483941/pexels-photo-4483941.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'inventory-classifier';

-- Mardams Job Order System — replace 'REPLACE_WITH_SLUG' with its actual slug
-- (see the SELECT above).
update public.projects set image = 'https://images.pexels.com/photos/17710109/pexels-photo-17710109/free-photo-of-sewing-machines.jpeg?auto=compress&cs=tinysrgb&w=1200'
  where slug = 'REPLACE_WITH_SLUG';
