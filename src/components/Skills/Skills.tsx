import { lazy, Suspense } from 'react'
import { Layers, Server, LineChart, Workflow, Database } from 'lucide-react'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { skillCategories } from '@/data/skills'
import { SkillCard } from './SkillCard'

const SkillsScene = lazy(() =>
  import('@/components/ThreeScene/scenes/SkillsScene').then((m) => ({ default: m.SkillsScene }))
)

const ICONS = [Layers, Server, LineChart, Workflow, Database]
const ACCENTS = ['#6EE7A0', '#C7E38A', '#6EE7A0', '#C7E38A', '#6EE7A0']
const BACKGROUNDS: Record<string, string> = {
  frontend: '/skill-images/frontend.svg',
  backend: '/skill-images/backend.svg',
  data: '/skill-images/data.svg',
  automation: '/skill-images/automation.svg',
  'ops-platforms': '/skill-images/ops-platforms.svg',
}

export function Skills() {
  return (
    <Section
      id="skills"
      label="Skills"
      className="border-t border-border-soft bg-surface/30 relative overflow-hidden"
    >
      <Suspense fallback={null}>
        <SkillsScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-surface/35 via-surface/5 to-surface/35 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          index="02 / Skills"
          title="A technology ecosystem, not a checklist."
          description="Hover a category to see what's inside it."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, i) => (
            <RevealOnScroll key={category.id} delay={i * 0.06}>
              <SkillCard
                category={category}
                icon={ICONS[i]}
                accent={ACCENTS[i]}
                background={BACKGROUNDS[category.id]}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </Section>
  )
}
