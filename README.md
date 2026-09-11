# Jopet Pallarcon — Portfolio

An interactive, 3D-accented portfolio built with React, TypeScript, Three.js
(React Three Fiber), GSAP, Framer Motion, and Tailwind CSS.

## What's real vs. what to fill in

This portfolio is seeded with real content pulled from your actual work
(the inventory reconciliation pipeline, the Warehouse Ops Console, the
Shopify/GA4 analytics dashboards, etc. — see `src/data/`). A few things
were deliberately left as placeholders rather than invented, and need your
input before this goes live:

- **`src/data/experience.ts`** — only your current UBEST role is filled in
  with real detail. Duplicate that entry with your earlier roles (or delete
  the placeholder if this is your first).
- **Contact info** (Email / Phone / LinkedIn) — now editable from the admin
  panel's "Contact info" tab instead of hardcoded, so you can update it
  without redeploying. It starts out with placeholder values (`jet-dev`,
  a fake phone number) until you set real ones — see the admin panel
  section below. The Footer's GitHub/LinkedIn/Email icons
  (`src/components/Footer/Footer.tsx`) are still hardcoded; swap in your
  real handles there separately.
- **`public/resume.pdf`** — the "Download Resume" button links here; add
  your actual resume PDF to `public/`.
- **`public/og-image.png`** — referenced in the social-share meta tags in
  `index.html`; add a real 1200×630 image, or remove the tags if you'd
  rather not have a link preview image.
- **The contact form** (`src/components/Contact/ContactForm.tsx`) currently
  simulates a submission. Wire the `handleSubmit` function up to a real
  endpoint — [Formspree](https://formspree.io), a small serverless
  function, or your own API all work.
- **`index.html`** — update `sameAs` URLs in the structured data block and
  the canonical/OG URLs once you have a real domain.

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
```

## Admin panel (add/edit projects without redeploying)

The Projects section now reads from a Supabase table instead of only the
hardcoded list in `src/data/projects.ts` (that file is kept as a fallback
so the site still works before you set this up). A login-protected `/admin`
page lets you add, edit, and delete projects, and changes appear on the
live site the next time it loads — no rebuild or redeploy needed.

**1. Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is enough).

**2. Run the migrations.** In the Supabase dashboard, go to SQL Editor > New
query, paste the contents of `supabase/migrations/0001_create_projects.sql`,
and run it. This creates the `projects` table with row-level security
(anyone can read; only logged-in users can write). Then do the same with
`supabase/migrations/0002_create_site_contact.sql`, which creates a
`site_contact` table (a single editable row for Email/Phone/LinkedIn,
seeded with placeholder values) behind the same read/write policy pattern.

**3. (Optional) Seed your existing projects.** Run `supabase/seed.sql` the
same way to preload the 5 projects that used to be hardcoded, so the table
isn't empty.

**4. Create your admin login.** In the Supabase dashboard, go to
Authentication > Users > Add user, and set an email + password for
yourself. This is the only account that will be able to sign in — there's
no public sign-up.

**5. Add your environment variables.** Copy `.env.example` to `.env.local`
and fill in your project's URL and anon key (Project Settings > API):
```bash
cp .env.example .env.local
```

**6. Restart the dev server**, then visit `/admin` and sign in with the
user you created in step 4. You'll land on `/admin/dashboard`, which has
two tabs: **Projects** (add, edit, delete) and **Contact info** (edit the
Email/Phone/LinkedIn shown in the Contact section).

If you deploy to Vercel/Netlify/etc., add the same two env vars
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in that platform's project
settings so the live build can reach Supabase too.

## Building for production

```bash
npm run build      # type-checks, then builds to /dist
npm run preview    # serve the production build locally to sanity-check it
```

## Deployment

The build output in `/dist` is a static site — it deploys anywhere that
serves static files. A few common options:

**Vercel**
```bash
npm i -g vercel
vercel
```
Vercel auto-detects Vite; no config needed.

**Netlify**
```bash
npm run build
```
Then drag-and-drop the `dist/` folder into the Netlify dashboard, or
connect the repo with build command `npm run build` and publish directory
`dist`.

**GitHub Pages**
Add a `base` path in `vite.config.ts` if deploying to a project page
(`https://username.github.io/repo-name/`):
```ts
export default defineConfig({
  base: '/repo-name/',
  // ...
})
```
Then build and push the `dist/` contents to a `gh-pages` branch (the
`gh-pages` npm package automates this).

## Architecture

```
src/
  components/
    Navbar/        Floating nav, scroll-spy active state, mobile menu
    Hero/           Full-screen hero, wires up the 3D scene + copy + CTAs
    About/          Intro, stack tags, animated stat counters
    Skills/         Hover-reveal category cards
    Projects/       Tilt cards + shared-layout detail modal
    Experience/     GSAP ScrollTrigger-driven timeline
    Analytics/      Recharts dashboard (sales, inventory, revenue, forecast)
    Services/       Expandable service cards
    Contact/        Validated contact form + direct links
    Footer/
    ThreeScene/     The hero's R3F scene, split into small pieces:
                      Scene.tsx      — Canvas, lighting, visibility pausing,
                                       WebGL detection, orchestration
                      CoreObject.tsx — the central wireframe icosahedron
                      DataNodes.tsx  — orbiting nodes + connector lines
                      Particles.tsx  — background particle field
                      CameraRig.tsx  — mouse parallax + scroll-linked camera
                      Fallback.tsx   — static art for no-WebGL devices
    CustomCursor/   Cursor dot + ring, disabled on touch
    Loader/         Short loading screen shown before first paint
    Admin/          Login form, protected dashboard, add/edit project form
                    — reads/writes the Supabase `projects` table
    shared/         Section shell, scroll-reveal wrapper, tags, magnetic
                     button, animated counter — reused across sections

  data/             All content lives here as typed data, not hardcoded
                    in components — projects.ts, skills.ts, experience.ts,
                    services.ts, analytics.ts

  hooks/            useMousePosition, useScrollProgress, useActiveSection,
                    useMediaQuery (+ reduced-motion/touch/mobile variants),
                    useWebGLSupport, useInView

  index.css         Tailwind v4 theme tokens (color/type scale) + globals
```

**Performance & accessibility choices worth knowing about:**
- The 3D scene is lazy-loaded (`React.lazy`) and only mounts once the hero
  is in view; its render loop pauses entirely via `IntersectionObserver`
  when scrolled out of view, and falls back to static SVG art if WebGL
  isn't available.
- `prefers-reduced-motion` is respected throughout — the 3D scene freezes,
  scroll reveals become instant, and the custom cursor still works but the
  underlying content isn't gated behind motion.
- The custom cursor and mouse-parallax effects are automatically disabled
  on touch devices (`pointer: coarse`).
- Charts only render once their container scrolls into view, so their
  entrance animation actually triggers on reveal rather than on page load.
- All interactive elements are keyboard-reachable with visible focus
  states (see `:focus-visible` rules in `index.css`); the project modal
  traps focus on open and closes on `Escape`.

## Design system

Dark, low-saturation base (`--color-canvas`/`--color-surface`) with two
accents — teal for data/technical moments, amber for warehouse/ops
moments — plus a reused **Keep / Watch / Reduce / Remove** status-tag motif
borrowed directly from the real inventory classification project, rather
than a generic badge system. Display type is Space Grotesk, body is Inter,
and IBM Plex Mono is reserved for actual data labels (stats, tags, section
indices) rather than decorative eyebrows.

All of this lives in `src/index.css` under the `@theme` block (Tailwind v4)
— change the hex values there to re-theme the whole site.
