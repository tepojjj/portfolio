import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CoreObject } from './CoreObject'
import { DataNodes } from './DataNodes'
import { Particles } from './Particles'
import { CameraRig } from './CameraRig'
import { Fallback } from './Fallback'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { usePrefersReducedMotion, useIsTouchDevice } from '@/hooks/useMediaQuery'

interface SceneProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  scrollProgress: number
}

/** Hero 3D scene: floating wireframe core, orbiting data nodes, drifting
 * particles, and a camera that responds to mouse + scroll. Pauses rendering
 * entirely when scrolled out of view and falls back to static art when
 * WebGL isn't available or the user prefers reduced motion on low-end devices. */
export function Scene({ containerRef, scrollProgress }: SceneProps) {
  const webglSupported = useWebGLSupport()
  const reducedMotion = usePrefersReducedMotion()
  const isTouch = useIsTouchDevice()

  const visibleRef = useRef(true)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    scrollRef.current = scrollProgress
  }, [scrollProgress])

  // Pause the render loop entirely when the hero scrolls out of view.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  // Mouse-based parallax (skipped on touch devices).
  useEffect(() => {
    if (isTouch) return
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isTouch])

  if (webglSupported === false) {
    return <Fallback />
  }

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 4, 5]} intensity={1.1} color="#6EE7A0" />
        <pointLight position={[-5, -3, -4]} intensity={0.6} color="#C7E38A" />
        <directionalLight position={[0, 5, 2]} intensity={0.3} />

        {/* Core + orbiting nodes are shifted right as a pair so the globe
            sits clear of the text column instead of hanging dead-center
            with empty canvas on either side. Particles stay centered as an
            ambient full-bleed backdrop. */}
        <group position={[1.7, 0, 0]}>
          <CoreObject visibleRef={visibleRef} reducedMotion={reducedMotion} />
          <DataNodes visibleRef={visibleRef} reducedMotion={reducedMotion} />
        </group>
        <Particles visibleRef={visibleRef} reducedMotion={reducedMotion} count={isTouch ? 90 : 220} />
        <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
