import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Section, SectionHeading } from '@/components/shared/Section'
import { useExperience } from '@/hooks/useExperience'
import { Tag } from '@/components/shared/StatusTag'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const ExperienceScene = lazy(() =>
  import('@/components/ThreeScene/scenes/ExperienceScene').then((m) => ({ default: m.ExperienceScene }))
)

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const { experience } = useExperience()

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.experience-item')
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: reducedMotion ? 0 : 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion, experience])

  return (
    <Section
      id="experience"
      label="Experience"
      className="border-t border-border-soft bg-surface/30 relative overflow-hidden"
    >
      <Suspense fallback={null}>
        <ExperienceScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-surface/35 via-surface/5 to-surface/35 pointer-events-none" />

      <div className="relative z-10">
      <SectionHeading index="04 / Experience" title="Where the work has happened." />

      <div ref={containerRef} className="relative pl-8 md:pl-10">
        <div className="absolute left-[3px] md:left-[3px] top-1 bottom-1 w-px bg-border">
          <div className="timeline-line absolute inset-0 bg-teal origin-top" />
        </div>

        <div className="space-y-14">
          {experience.map((entry) => (
            <div key={entry.id} className="experience-item relative">
              <div className="absolute -left-8 md:-left-10 top-1.5 w-2 h-2 rounded-full bg-teal" />

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                <span className="font-mono text-xs text-teal">{entry.date}</span>
                <h3 className="font-display text-xl md:text-2xl text-text-high">{entry.position}</h3>
                <span className="text-text-mid text-sm">· {entry.company}</span>
              </div>

              {entry.placeholder ? (
                <p className="text-sm text-text-low italic max-w-xl">{entry.responsibilities[0]}</p>
              ) : (
                <>
                  <ul className="mt-3 space-y-1.5 max-w-xl">
                    {entry.responsibilities.map((r) => (
                      <li key={r} className="text-sm text-text-mid flex gap-2">
                        <span className="text-text-low">•</span> {r}
                      </li>
                    ))}
                  </ul>

                  {entry.achievements.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      {entry.achievements.map((a) => (
                        <p key={a} className="text-sm text-amber flex gap-2">
                          <span>↑</span> {a}
                        </p>
                      ))}
                    </div>
                  )}

                  {entry.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {entry.tech.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </Section>
  )
}
