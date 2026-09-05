import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}

/** Counts up from 0 to `value` once the element enters the viewport. */
export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1400 }: AnimatedCounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 })
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (reducedMotion) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration, reducedMotion])

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}
