import { techStack, type TechCategory, type TechItem } from '@/data/techStack'

/** One scrolling row per tech category (Languages, Frameworks & Libraries,
 * Databases & Data Integration, Automation), each labeled and scrolling in
 * an alternating direction so the stack reads as organized groups rather
 * than one flat list of words. */
export function Marquee() {
  return (
    <div aria-hidden="true" className="border-y border-border-soft bg-surface">
      {techStack.map((category, i) => (
        <MarqueeRow key={category.id} category={category} reverse={i % 2 === 1} />
      ))}
    </div>
  )
}

function MarqueeRow({ category, reverse }: { category: TechCategory; reverse: boolean }) {
  // Render the list twice back-to-back; the track animates exactly -50%,
  // so the seam between the two copies is invisible and the loop is seamless.
  const track = [...category.items, ...category.items]

  return (
    <div className="relative flex items-stretch border-b border-border-soft last:border-b-0">
      {/* Category label, pinned to the left on larger screens */}
      <div className="hidden sm:flex w-44 md:w-56 shrink-0 items-center border-r border-border-soft bg-surface-raised/40 px-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-low leading-snug">
          {category.title}
        </p>
      </div>

      <div className="relative flex-1 min-w-0 overflow-hidden py-4">
        {/* Same label, shown above the row on mobile where the side rail is hidden */}
        <p className="sm:hidden px-5 pb-2.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
          {category.title}
        </p>

        <div className={`flex w-max gap-3 px-5 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
          {track.map((item, i) => (
            <TechChip key={`${item.name}-${i}`} item={item} />
          ))}
        </div>

        {/* Fade the strip into the surrounding background at both edges. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 bg-gradient-to-l from-surface to-transparent" />
      </div>
    </div>
  )
}

function TechChip({ item }: { item: TechItem }) {
  return (
    <span className="inline-flex items-center gap-2 shrink-0 px-4 py-2 border border-border-soft bg-surface-raised/40 rounded-full">
      <span className="flex items-center justify-center w-4 h-4 shrink-0">
        {item.Icon ? (
          <item.Icon size={16} color={item.color} />
        ) : item.image ? (
          <img src={item.image} alt="" className="max-h-4 max-w-4 w-auto h-auto object-contain" />
        ) : null}
      </span>
      <span className="font-mono text-xs md:text-sm text-text-mid whitespace-nowrap">{item.name}</span>
    </span>
  )
}
