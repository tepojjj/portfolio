import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProps {
  onDone: () => void
}

/** Brief, minimal loading screen — a name, a progress readout, then a clean
 * handoff into the page. Keeps its own timer short by design. */
export function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const durationMs = 1100
    let frame = 0

    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1)
      setProgress(Math.round(p * 100))
      if (p < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        setTimeout(onDone, 500)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onDone])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] bg-canvas flex flex-col items-center justify-center"
        >
          <div className="font-display text-2xl md:text-3xl tracking-tight text-text-high">
            Jopet Pallarcon<span className="text-teal">.</span>
          </div>
          <div className="mt-6 w-40 h-px bg-border relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-teal transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 font-mono text-xs text-text-low">{progress}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
