import { useEffect, useRef, useState } from 'react'
import { Code2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import { Tag } from '@/components/shared/StatusTag'
import { hasRealImage, getProjectIcon } from '@/utils/projectVisual'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface ProjectCardProps {
  project: Project
  onOpen: () => void
}

const accentColor = { teal: 'var(--color-teal)', amber: 'var(--color-amber)' }

/** How long the site has to stay hovered before the iframe starts loading —
 * avoids firing a live request for every card the cursor just passes over. */
const HOVER_DELAY_MS = 350
/** How long each tab stays on screen before sliding to the next one. */
const TAB_INTERVAL_MS = 2600

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const Icon = getProjectIcon(project)
  const reducedMotion = usePrefersReducedMotion()
  const tabs = project.previewUrls && project.previewUrls.length > 0 ? project.previewUrls : project.demo ? [project.demo] : []

  const [previewLive, setPreviewLive] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slideInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const stopPreview = () => {
    clearTimeout(hoverTimeout.current)
    clearInterval(slideInterval.current)
    setPreviewLive(false)
    setTabIndex(0)
  }

  const startHover = () => {
    if (tabs.length === 0) return
    hoverTimeout.current = setTimeout(() => setPreviewLive(true), HOVER_DELAY_MS)
  }

  useEffect(() => {
    if (!previewLive || reducedMotion || tabs.length < 2) return
    slideInterval.current = setInterval(() => {
      setTabIndex((i) => (i + 1) % tabs.length)
    }, TAB_INTERVAL_MS)
    return () => clearInterval(slideInterval.current)
  }, [previewLive, reducedMotion, tabs.length])

  useEffect(() => () => stopPreview(), [])

  return (
    <motion.div layoutId={`project-${project.id}`} className="group relative">
      <button
        onClick={onOpen}
        onMouseEnter={startHover}
        onMouseLeave={stopPreview}
        data-cursor="interactive"
        className="w-full text-left bg-surface border border-border overflow-hidden relative transition-transform duration-300 ease-out hover:-translate-y-1"
      >
        {/* Preview panel: live site on hover (if there's a demo URL), else a real
            screenshot when one's been added, else a themed icon */}
        <div className="relative h-52 md:h-60 overflow-hidden border-b border-border bg-surface-raised">
          {previewLive ? (
            <iframe
              key={tabs[tabIndex]}
              src={tabs[tabIndex]}
              title={`${project.name} live preview`}
              className="absolute inset-0 w-full h-full pointer-events-none border-0"
              style={{ transform: 'scale(1.01)' }}
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
            />
          ) : hasRealImage(project.image) ? (
            <img
              src={project.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${accentColor[project.accent]}22 0%, transparent 60%), var(--color-surface-raised)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon
                  size={56}
                  strokeWidth={1.5}
                  className="opacity-25"
                  style={{ color: accentColor[project.accent] }}
                />
              </div>
            </>
          )}

          {previewLive && tabs.length > 1 && (
            <div className="absolute top-3 right-3 flex gap-1">
              {tabs.map((url, i) => (
                <span
                  key={url}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === tabIndex ? 14 : 6,
                    background: i === tabIndex ? accentColor[project.accent] : 'var(--color-border)',
                  }}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <span className="font-mono text-[11px] text-text-low bg-canvas/60 px-1.5 py-0.5">
              {previewLive ? 'Live preview' : project.tagline}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl text-text-high">{project.name}</h3>
          <p className="mt-2 text-sm text-text-mid line-clamp-2">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(project.tech ?? []).slice(0, 4).map((t) => (
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
      </button>
    </motion.div>
  )
}
