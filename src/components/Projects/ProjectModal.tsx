import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Code2, ExternalLink } from 'lucide-react'
import type { Project } from '@/data/projects'
import { Tag } from '@/components/shared/StatusTag'
import { normalizeUrl } from '@/utils/url'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const accentColor = { teal: 'var(--color-teal)', amber: 'var(--color-amber)' }

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} details`}
          className="fixed inset-0 z-[90] flex items-start md:items-center justify-center p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-canvas/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            layoutId={`project-${project.id}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:max-w-3xl max-h-[92svh] md:max-h-[85vh] overflow-y-auto bg-surface border border-border md:rounded-sm"
          >
            <div
              className="h-40 md:h-52 relative border-b border-border shrink-0"
              style={{
                background: `radial-gradient(circle at 25% 20%, ${accentColor[project.accent]}33 0%, transparent 65%), var(--color-surface-raised)`,
              }}
            >
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close project details"
                data-cursor="interactive"
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-border bg-surface/80 text-text-high hover:border-teal hover:text-teal transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="font-mono text-xs text-text-low mb-1">{project.tagline}</p>
                <h3 className="font-display text-2xl md:text-3xl text-text-high">{project.name}</h3>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Problem" text={project.problem} />
                <Field label="Solution" text={project.solution} />
                <Field label="Architecture" text={project.architecture} />
                <Field label="Challenges" text={project.challenges} />
              </div>

              <div>
                <p className="font-mono text-xs text-text-low mb-3">KEY FEATURES</p>
                <ul className="space-y-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-text-mid">
                      <span className="text-teal mt-1.5 w-1 h-1 rounded-full bg-teal shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-6">
                <p className="font-mono text-xs text-text-low mb-2">RESULTS</p>
                <p className="text-text-mid text-sm">{project.results}</p>
              </div>

              <div className="flex gap-3 pt-2">
                {(() => {
                  const github = normalizeUrl(project.github)
                  const demo = normalizeUrl(project.demo)
                  return (
                    <>
                      {github && (
                        <a
                          href={github}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="interactive"
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm text-text-high hover:border-teal hover:text-teal transition-colors"
                        >
                          <Code2 size={16} /> View Code
                        </a>
                      )}
                      {demo && (
                        <a
                          href={demo}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="interactive"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-canvas text-sm hover:bg-teal/90 transition-colors"
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                      {!github && !demo && (
                        <p className="text-text-low text-sm font-mono">
                          No code or live link added for this project yet.
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-mono text-xs text-text-low mb-2">{label.toUpperCase()}</p>
      <p className="text-sm text-text-mid leading-relaxed">{text}</p>
    </div>
  )
}
