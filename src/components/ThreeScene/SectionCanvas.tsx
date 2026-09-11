import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { usePrefersReducedMotion, useIsTouchDevice, useIsMobile } from '@/hooks/useMediaQuery'

export interface SceneRenderArgs {
  /** Ref that's true only while the section is on-screen — check this in every useFrame. */
  visibleRef: React.RefObject<boolean>
  /** Normalized (-1..1) mouse position, for parallax. Frozen at (0,0) on touch devices. */
  mouseRef: React.RefObject<{ x: number; y: number }>
  reducedMotion: boolean
  isMobile: boolean
}

interface SectionCanvasProps {
  /** Render prop so each scene gets the same visibility/perf plumbing without repeating it. */
  children: (args: SceneRenderArgs) => ReactNode
  /** Static, dependency-free visual shown when WebGL is unavailable. */
  fallback?: ReactNode
  cameraPosition?: [number, number, number]
  fov?: number
  className?: string
  /** Lower DPR / skip effects for sections that are more decorative than focal. */
  lightweight?: boolean
}

/**
 * Shared background-canvas shell for every non-Hero section. Handles the boring parts once:
 * pausing the render loop off-screen, bailing out to a static fallback without WebGL or with
 * reduced-motion, and tracking mouse position for gentle parallax. Each section supplies only
 * its own geometry via the render-prop `children`.
 */
export function SectionCanvas({
  children,
  fallback = null,
  cameraPosition = [0, 0, 6],
  fov = 45,
  className = '',
  lightweight = false,
}: SectionCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  const webglSupported = useWebGLSupport()
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useIsTouchDevice()
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05, rootMargin: '10% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isTouch) return
    const el = wrapperRef.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isTouch])

  return (
    <div ref={wrapperRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {webglSupported === false ? (
        fallback
      ) : webglSupported === null ? null : (
        <Canvas
          dpr={lightweight ? [1, 1.25] : [1, 1.5]}
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Suspense fallback={null}>
            {children({ visibleRef, mouseRef, reducedMotion, isMobile })}
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
