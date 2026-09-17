import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { services } from '@/data/services'

const ServicesScene = lazy(() =>
  import('@/components/ThreeScene/scenes/ServicesScene').then((m) => ({ default: m.ServicesScene }))
)

const BACKGROUNDS: Record<string, string> = {
  'web-dev':
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=70',
  'data-analytics':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70',
  dashboards:
    'https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&w=800&q=70',
  automation:
    'https://images.unsplash.com/photo-1743385779347-1549dabf1320?auto=format&fit=crop&w=800&q=70',
  ecommerce:
    'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?auto=format&fit=crop&w=800&q=70',
  inventory:
    'https://images.unsplash.com/photo-1644079446600-219068676743?auto=format&fit=crop&w=800&q=70',
  'api-integration':
    'https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?auto=format&fit=crop&w=800&q=70',
}

export function Services() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Section
      id="services"
      label="Services"
      className="border-t border-border-soft bg-surface/30 relative overflow-hidden"
    >
      <Suspense fallback={null}>
        <ServicesScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-surface/35 via-surface/5 to-surface/35 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          index="06 / Services"
          title="How I can help."
          description="Scoped around the actual problems retail and warehouse teams run into."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const isOpen = expanded === service.id
            const Icon = service.icon
            return (
              <RevealOnScroll key={service.id} delay={i * 0.04}>
                <motion.button
                  onClick={() => setExpanded(isOpen ? null : service.id)}
                  whileHover={{ y: -4 }}
                  data-cursor="interactive"
                  className="group w-full text-left rounded-2xl border border-border bg-surface overflow-hidden"
                >
                  {BACKGROUNDS[service.id] && (
                    <div className="relative h-32 w-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${BACKGROUNDS[service.id]})` }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-surface) 55%, transparent) 60%, var(--color-surface) 96%)',
                        }}
                      />
                    </div>
                  )}

                  <div className={`px-6 pb-6 ${BACKGROUNDS[service.id] ? '-mt-6' : 'pt-6'}`}>
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg border backdrop-blur-sm bg-surface/85 border-border text-teal group-hover:border-teal group-hover:rotate-6 transition-all duration-300">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 font-display text-lg text-text-high">{service.title}</h3>
                    <p className="mt-2 text-sm text-text-mid">{service.description}</p>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-sm text-amber border-t border-border-soft pt-3">{service.details}</p>
                    </div>

                    <span className="mt-4 inline-block text-xs text-text-low group-hover:text-teal transition-colors">
                      {isOpen ? 'Show less' : 'Learn more'}
                    </span>
                  </div>
                </motion.button>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
