import { skillCategories } from '@/data/skills'

// Flatten + de-dupe every skill across categories into one scrolling strip.
const items = Array.from(new Set(skillCategories.flatMap((c) => c.skills)))

export function Marquee() {
  // Render the list twice back-to-back; the track animates exactly -50%,
  // so the seam between the two copies is invisible and the loop is seamless.
  const track = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border-soft bg-surface py-5"
    >
      <div className="flex w-max animate-marquee">
        {track.map((skill, i) => (
          <span key={`${skill}-${i}`} className="flex items-center shrink-0">
            <span
              className={`px-6 font-mono text-sm md:text-base whitespace-nowrap tracking-wide ${
                i % 2 === 0 ? 'text-text-high' : 'text-teal'
              }`}
            >
              {skill}
            </span>
            <span className="text-text-low text-xs" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </div>

      {/* Fade the strip into the surrounding background at both edges. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent" />
    </div>
  )
}
