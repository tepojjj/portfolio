import { lazy, Suspense } from 'react'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { Tag } from '@/components/shared/StatusTag'

const AboutScene = lazy(() =>
  import('@/components/ThreeScene/scenes/AboutScene').then((m) => ({ default: m.AboutScene }))
)

const stats = [
  { value: 5, suffix: '', label: 'Production Tools Shipped' },
  { value: 62000, suffix: '+', label: 'SKUs Under Management' },
  { value: 64, suffix: '', label: 'Stores Supported' },
  { value: 90, suffix: '%', prefix: '↓', label: 'Manual Reconciliation Cut' },
]

const stack = [
  'React', 'TypeScript', 'Python', 'Pandas', 'Node.js / Express',
  'SQL', 'Lark / Feishu Base', 'GA4 & Looker Studio', 'Three.js',
]

export function About() {
  return (
    <Section id="about" label="About" className="border-t border-border-soft relative overflow-hidden">
      <Suspense fallback={null}>
        <AboutScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/10 via-canvas/40 to-canvas/70 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          index="01 / About"
          title="I build the tools operations teams actually use."
          description="Not demos the internal systems that stay open on someone's screen all day."
        />

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <RevealOnScroll className="md:col-span-3" direction="left">
            <div className="space-y-5 text-text-mid text-base md:text-lg leading-relaxed">
              <p>
                I work across web development, data analytics, and automation mostly in service
                of retail and warehouse operations, where the gap between "the data exists" and
                "someone can actually use it" tends to be widest.
              </p>
              <p>
                Day to day, that means building React web apps and backend APIs, reconciling
                inventory data across dozens of stores, and designing automation inside no-code
                platforms like Lark Base when a full custom build isn't the right call. I like
                picking the simplest tool that actually solves the problem, not the most impressive one.
              </p>
              <p>
                Outside of operational tooling, I build web applications and 3D interactive
                experiences this site included as a way of staying sharp on the frontend side
                of things.
              </p>
            </div>

            <div className="mt-10">
              <p className="font-mono text-xs text-text-low mb-4">CURRENT STACK</p>
              <div className="flex flex-wrap gap-2">
                {stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="md:col-span-2" direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-px bg-border border border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface p-6">
                  <div className="font-display text-3xl md:text-4xl text-text-high">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="mt-2 text-sm text-text-mid">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  )
}
