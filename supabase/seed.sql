-- Optional: preload the 5 projects that were previously hardcoded in
-- src/data/projects.ts, so the site isn't empty right after migrating.
-- Run this once in the Supabase SQL Editor, after 0001_create_projects.sql.

insert into public.projects
  (slug, name, tagline, description, image, tech, features, problem, solution, architecture, challenges, results, accent, sort_order)
values
  (
    'inventory-reconciliation',
    'Inventory Reconciliation Pipeline',
    'Cleaning up 62,000 SKUs across 64 stores',
    'A Python pipeline that cross-references live Lark Base exports against Excel master files to catch and correct per-store inventory discrepancies, then automates floor and zone assignment at scale.',
    'https://images.pexels.com/photos/4484154/pexels-photo-4484154.jpeg?auto=compress&cs=tinysrgb&w=1200',
    array['Python', 'Pandas', 'Lark Base API', 'Excel'],
    array['Cross-references Lark Base exports against Excel masters', 'Flags and corrects per-store discrepancies automatically', 'Automated floor/zone assignment for ~62,000 product rows', 'Store-by-store diff reports for manual review'],
    'Product data across 64 stores drifted out of sync between the operational database (Lark Base) and the Excel files store teams actually worked from, so mismatched floor assignments, stale quantities, and duplicate rows accumulated faster than anyone could fix them by hand.',
    'Built a Python reconciliation pipeline that pulls both sources, aligns them on SKU, and surfaces exactly what changed, including additions, removals, and floor reassignments, before writing corrections back in bulk instead of row by row.',
    'Pandas handles the diffing and transformation layer. The Lark Base API supplies live store data; Excel master files are parsed with openpyxl. A rules engine maps product categories to floor/zone codes and reruns cleanly on a schedule.',
    'The biggest issue was inconsistent product naming between systems. The same item could appear with three slightly different labels, and matching had to be resilient to that without silently merging genuinely different products.',
    'Reduced a recurring multi-day manual reconciliation task to a script that runs in minutes, with a clean audit trail of every correction applied across all 64 stores.',
    'teal',
    0
  ),
  (
    'warehouse-ops-console',
    'Warehouse Ops Console',
    'One dashboard for the whole warehouse floor',
    'A React admin console connected to a Lark Base backend for searching and editing products, generating QR codes and print-ready labels, and watching live stock stats without opening the base directly.',
    'https://images.pexels.com/photos/4483862/pexels-photo-4483862.jpeg?auto=compress&cs=tinysrgb&w=1200',
    array['React', 'Express', 'Lark Base API', 'OAuth'],
    array['Collapsible sidebar with live stats cards on the homepage', 'Search and modify product records in place', 'Built-in QR code generator', 'Print-ready label generator'],
    'Warehouse staff needed to look up and correct product data constantly, but the underlying Lark Base was not something non-technical staff could safely edit directly, since one wrong formula edit could break records for every store.',
    'A purpose-built console that only exposes the actions staff actually need: search, edit, relabel, and check stock, with an Express backend brokering OAuth-authenticated access to the base so the raw data stays protected.',
    'React frontend talks to an Express API layer, which holds the Lark Base OAuth grant and exposes scoped endpoints for reads and writes. The label and QR generators run client-side against the same product records.',
    'Lark Base''s API has real quirks around rate limits and field-type formatting, so the Express layer had to normalize responses before the frontend ever saw them.',
    'Store and warehouse staff now handle day-to-day product lookups and label printing themselves, without needing base access or engineering support for routine changes.',
    'amber',
    1
  ),
  (
    'retail-analytics',
    'Retail & Shopify Analytics Dashboards',
    'Turning storefront data into decisions',
    'Looker Studio dashboards built on GA4 and Shopify data pipelines, giving a clear read on sales, product performance, and revenue trends without digging through raw exports.',
    'https://images.pexels.com/photos/20142114/pexels-photo-20142114/free-photo-of-financial-report-data-presentation-expense-and-cost-calculations.jpeg?auto=compress&cs=tinysrgb&w=1200',
    array['Looker Studio', 'GA4', 'Shopify API', 'SQL'],
    array['Sales monitoring across channels', 'Product-level performance breakdowns', 'Revenue tracking with period comparisons', 'Automated data refresh from Shopify'],
    'Sales and product performance data lived in Shopify and GA4 separately, which meant stitching together spreadsheets by hand every time someone needed a real answer about what was actually selling.',
    'Connected Shopify and GA4 data into unified Looker Studio dashboards, so revenue, product performance, and traffic could be read side by side and refreshed automatically instead of rebuilt each time.',
    'Shopify API pulls order and product data into a scheduled pipeline; GA4 supplies behavioral data. Looker Studio sits on top as the presentation layer, with SQL used to shape and join the underlying data.',
    'Reconciling GA4 event-based data with Shopify order data required care: the two systems count things (like sessions vs. completed orders) differently, and the dashboards needed to be honest about that rather than papering over it.',
    'Gave the team a single, trustworthy view of sales and product performance that updates on its own, replacing a manual reporting process.',
    'teal',
    2
  ),
  (
    'fuzzy-import',
    'Product Import & Matching Tool',
    'Fuzzy-matching messy product data on import',
    'A tool that parses product files in almost any format, including XLSX, CSV, PDF, and even scanned images via OCR, and uses Sørensen–Dice string matching to reconcile them against existing catalog data before import.',
    'https://images.pexels.com/photos/5717779/pexels-photo-5717779.jpeg?auto=compress&cs=tinysrgb&w=1200',
    array['Python', 'OCR', 'Sørensen–Dice Matching'],
    array['Multi-format parsing: XLSX, CSV, PDF, and image/OCR', 'Fuzzy name matching to catch near-duplicate products', 'Update-import preview before anything is written', 'Handles inconsistent supplier naming conventions'],
    'New product lists arrived from different suppliers in different formats, with product names that never quite matched the existing catalog. Manually reconciling them before each import was slow and error-prone.',
    'A single import tool that accepts whatever format a supplier sends, extracts the product data (including OCR for scanned sheets), and uses Sørensen–Dice coefficient matching to line new entries up against existing catalog items, flagging likely duplicates instead of creating them.',
    'A format-detection layer routes each file to the right parser (spreadsheet, PDF text extraction, or OCR). Matched and unmatched rows are staged in a preview step before any catalog write happens.',
    'Tuning the fuzzy-match threshold was the hard part: too loose and it merged genuinely different products, too strict and it missed obvious duplicates with minor spelling differences.',
    'Cut the manual review time on new product imports significantly, while giving whoever runs the import a clear preview instead of a blind bulk write.',
    'amber',
    3
  ),
  (
    'inventory-classifier',
    'Inventory Health Dashboard',
    'Keep, Watch, Reduce, or Remove, at a glance',
    'A React dashboard that reads CSV sales exports and classifies every product into Keep, Watch, Reduce, or Remove, with bilingual header parsing and a dedicated tab for spotting new arrivals.',
    'https://images.pexels.com/photos/4483941/pexels-photo-4483941.jpeg?auto=compress&cs=tinysrgb&w=1200',
    array['React', 'JavaScript', 'CSV Parsing'],
    array['Automatic Keep / Watch / Reduce / Remove classification', 'Bilingual header parsing for mixed-language exports', 'Dedicated New Arrival detection tab', 'Works directly from raw CSV sales exports'],
    'Deciding which products to keep stocking, discount, or discontinue relied on someone manually scanning sales spreadsheets, a slow, inconsistent process that made it easy to miss slow-moving stock buried in the data.',
    'A dashboard that ingests the raw sales CSV directly, parses headers regardless of language, and applies consistent rules to sort every product into an actionable status, so the conversation starts from a shared, objective list.',
    'Client-side CSV parsing feeds a classification layer built on configurable sales-velocity and stock-age thresholds. Results render as a filterable, sortable table with status tags driving the visual treatment.',
    'Source exports mixed English and another language in column headers inconsistently, so the parser had to recognize equivalent fields under either language rather than relying on exact header names.',
    'Replaced manual spreadsheet triage with a five-minute dashboard check, and surfaced new-arrival products that were previously easy to overlook in the raw data.',
    'teal',
    4
  )
on conflict (slug) do nothing;
