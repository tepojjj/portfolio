import { lazy, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useMousePosition } from '@/hooks/useMousePosition'

const Scene = lazy(() => import('@/components/ThreeScene'))

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useScrollProgress()
  const mouse = useMousePosition()

  const handleResume = () => {
    window.open('/resume', '_blank')
  }

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="Home"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <Scene containerRef={containerRef} scrollProgress={scrollProgress} />
        </Suspense>
      </div>

      {/* Vignette so the 3D scene supports the text instead of competing with it */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/55 via-transparent to-canvas pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/85 via-transparent to-canvas/45 pointer-events-none" />
      {/* Extra dark pocket right behind the globe so its wireframe glow reads
          clearly against the busy photo, rather than blending into it */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 68% 48%, color-mix(in srgb, var(--color-canvas) 55%, transparent) 0%, transparent 42%)',
        }}
      />

      <div
        className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-10"
        style={{
          transform: `translate(${mouse.normX * -6}px, ${mouse.normY * -4}px)`,
        }}
      >
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-sm text-teal mb-5"
          >
            Jopet Pallarcon
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-text-high text-balance"
          >
            Web Developer{' '}
            <span className="text-text-mid">·</span> Data Analyst{' '}
            <span className="text-text-mid">·</span> Automation Enthusiast
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 text-lg text-text-mid max-w-xl"
          >
            I build modern digital experiences, data-driven solutions, and automation systems
            that turn complex problems into simple, useful products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              variant="primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore My Work
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={handleResume}>
              View Resume
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Me
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-low hover:text-teal transition-colors"
        aria-label="Scroll to About section"
        data-cursor="interactive"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-mono text-[11px]">SCROLL</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  )
}
