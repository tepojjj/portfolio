import { useEffect, useRef, useState } from 'react'
import { useIsTouchDevice } from '@/hooks/useMediaQuery'

/** Custom cursor dot + ring that follows the pointer and expands over
 * interactive elements. Fully disabled on touch devices. */
export function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (isTouch) return

    const ring = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }
    let frame = 0

    const handleMove = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px)`
      }
      setHidden(false)

      const el = e.target as HTMLElement
      setActive(Boolean(el.closest('[data-cursor="interactive"], a, button')))
    }

    const animateRing = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      }
      frame = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', () => setHidden(true))
    frame = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(frame)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-teal"
      />
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 rounded-full border transition-[width,height,margin,border-color] duration-200 ease-out ${
          active ? 'w-10 h-10 -ml-5 -mt-5 border-teal' : 'w-6 h-6 -ml-3 -mt-3 border-text-low'
        }`}
      />
    </div>
  )
}
