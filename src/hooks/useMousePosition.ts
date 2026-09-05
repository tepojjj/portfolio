import { useEffect, useState } from 'react'

export interface MousePosition {
  x: number
  y: number
  normX: number // -1 to 1
  normY: number // -1 to 1
}

/** Tracks raw and viewport-normalized mouse position. Skips work on touch devices. */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, normX: 0, normY: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let frame = 0
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1
        const normY = (e.clientY / window.innerHeight) * 2 - 1
        setPosition({ x: e.clientX, y: e.clientY, normX, normY })
      })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return position
}
