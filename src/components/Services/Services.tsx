import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { services } from '@/data/services'

const ServicesScene = lazy(() =>
  import('@/components/ThreeScene/scenes/ServicesScene').then((m) => ({ default: m.ServicesScene }))
)

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
      <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/10 to-surface/70 pointer-events-none" />

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
                  className="w-full text-left bg-surface border border-border p-6 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-border text-teal group-hover:border-teal group-hover:rotate-6 transition-all duration-300">
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
                </motion.button>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
