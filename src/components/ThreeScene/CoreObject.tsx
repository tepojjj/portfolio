import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '@/hooks/useTheme'

interface CoreObjectProps {
  visibleRef: React.RefObject<boolean>
  reducedMotion: boolean
}

/** The central wireframe globe — the "floating object representing
 * technology/data" the brief asks for. Dense lat/long grid with a layered,
 * additive-blended glow (no postprocessing package needed — just three
 * copies of the wireframe at increasing scale / decreasing opacity, which
 * is how you fake a bloom halo without a real post-process pass) to read
 * as a bright neon sphere. Slowly spins on its Y-axis.
 *
 * Additive blending only reads as "glow" against a dark backdrop — on a
 * light canvas it just pushes everything toward white and the sphere
 * disappears. So in light mode this switches to normal blending with a
 * darker, more saturated color and lower opacity instead: a clean dark-teal
 * wireframe rather than a washed-out glow. */
export function CoreObject({ visibleRef, reducedMotion }: CoreObjectProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const color = isLight ? '#0f9d58' : '#6EE7A0'
  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending

  const groupRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    if (groupRef.current) {
      groupRef.current.rotation.y += speed * 0.15
    }
    if (haloRef.current) {
      const scale = 1 + Math.sin(t.current * 0.6) * 0.02
      haloRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Soft filled core so the sphere reads as solid-ish, not just lines */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.4, 32, 24]} />
        <meshBasicMaterial color={color} transparent opacity={isLight ? 0.05 : 0.06} />
      </mesh>

      {/* Dense wireframe grid — the main visible shape */}
      <mesh>
        <sphereGeometry args={[1.4, 40, 26]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={isLight ? 0.65 : 0.9}
          blending={blending}
          depthWrite={false}
        />
      </mesh>

      {/* Two outer copies, scaled up and faded out, faking a bloom halo around the grid lines.
          Skipped in light mode — there's no dark backdrop for a glow to read against, so
          these would just add haze on top of an already-readable wireframe. */}
      {!isLight && (
        <>
          <mesh scale={1.035}>
            <sphereGeometry args={[1.4, 40, 26]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.35}
              blending={blending}
              depthWrite={false}
            />
          </mesh>
          <mesh scale={1.08}>
            <sphereGeometry args={[1.4, 40, 26]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.12}
              blending={blending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
