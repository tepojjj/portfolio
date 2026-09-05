import { lazy, Suspense, useState } from 'react'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import type { Project } from '@/data/projects'
import { useProjects } from '@/hooks/useProjects'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

const ProjectsScene = lazy(() =>
  import('@/components/ThreeScene/scenes/ProjectsScene').then((m) => ({ default: m.ProjectsScene }))
)

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const { projects } = useProjects()

  return (
    <Section id="projects" label="Projects" className="border-t border-border-soft relative overflow-hidden">
      <Suspense fallback={null}>
        <ProjectsScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/10 via-canvas/40 to-canvas/70 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          index="03 / Projects"
          title="Systems built for stores, not slideware."
          description="Each one solves a specific operational problem. Click through for the details."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <RevealOnScroll key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} onOpen={() => setSelected(project)} />
            </RevealOnScroll>
          ))}
        </div>

        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </div>
    </Section>
  )
}
