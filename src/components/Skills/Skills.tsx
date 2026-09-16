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
// Photos hotlinked from Unsplash's CDN (free to embed under the Unsplash License,
// no download/rehosting needed — https://unsplash.com/license)
const BACKGROUNDS: Record<string, string> = {
  frontend:
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=70',
  backend:
    'https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=800&q=70',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70',
  automation:
    'https://images.unsplash.com/photo-1743385779347-1549dabf1320?auto=format&fit=crop&w=800&q=70',
  'ops-platforms':
    'https://images.unsplash.com/photo-1644079446600-219068676743?auto=format&fit=crop&w=800&q=70',
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
