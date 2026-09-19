// A real photo (circuit board macro shot, hotlinked from Unsplash's CDN —
// free to embed under https://unsplash.com/license, no rehosting needed)
// sitting fixed behind the whole page. Tinted heavily with the current
// theme's canvas color so it reads as texture in the gaps between
// sections/cards rather than a loud photo, and adapts automatically when
// the theme toggles since the tint uses the --color-canvas CSS variable.
const BACKGROUND_PHOTO =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=60'

export function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-center transition-[filter] duration-200"
        style={{
          backgroundImage: `url(${BACKGROUND_PHOTO})`,
          filter: 'var(--bg-photo-filter)',
        }}
      />
      <div
        className="absolute inset-0 transition-colors duration-200"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-canvas) var(--bg-photo-tint), transparent)',
        }}
      />
    </div>
  )
}
