import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  label: string
}

/** Consistent section shell: id for nav/scroll-spy, a mono data-label
 * (real wayfinding, not a decorative eyebrow), and shared max-width. */
export function Section({ id, children, className = '', label }: SectionProps) {
  return (
    <section id={id} aria-label={label} className={`relative py-24 md:py-32 px-6 md:px-10 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  index: string
  title: string
  description?: string
}

export function SectionHeading({ index, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-14 md:mb-20 flex items-end justify-between gap-8 border-b border-border pb-6">
      <div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-text-high text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-text-mid text-base md:text-lg">{description}</p>
        )}
      </div>
      <span className="font-mono text-xs text-text-low shrink-0 hidden sm:block">{index}</span>
    </div>
  )
}
