import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, ExternalLink } from 'lucide-react'
import type { Project } from '@/data/projects'
import { Tag } from '@/components/shared/StatusTag'
import { useIsTouchDevice } from '@/hooks/useMediaQuery'

interface ProjectCardProps {
  project: Project
  onOpen: () => void
}

const accentColor = { teal: 'var(--color-teal)', amber: 'var(--color-amber)' }

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouchDevice()
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: py * -6, ry: px * 8 })
  }

  const handleLeave = () => setTilt({ rx: 0, ry: 0 })

  return (
    <motion.div
      ref={ref}
      layoutId={`project-${project.id}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="group relative"
    >
      <motion.button
        onClick={onOpen}
        data-cursor="interactive"
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full text-left bg-surface border border-border overflow-hidden relative"
      >
        {/* Preview panel: abstract representation instead of a stock photo */}
        <div className="relative h-52 md:h-60 overflow-hidden border-b border-border">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${accentColor[project.accent]}22 0%, transparent 60%), var(--color-surface-raised)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display text-6xl md:text-7xl font-semibold opacity-20"
              style={{ color: accentColor[project.accent] }}
            >
              {project.name.charAt(0)}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="font-mono text-[11px] text-text-low">{project.tagline}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl text-text-high">{project.name}</h3>
          <p className="mt-2 text-sm text-text-mid line-clamp-2">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4 text-text-low">
            <span className="inline-flex items-center gap-1.5 text-xs">
              <Code2 size={14} /> Code
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <ExternalLink size={14} /> Live
            </span>
            <span className="ml-auto text-xs group-hover:text-teal transition-colors">View details →</span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  )
}
