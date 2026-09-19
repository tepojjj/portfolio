import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoreObjectProps {
  visibleRef: React.RefObject<boolean>
  reducedMotion: boolean
}

const CORE_COLOR = '#6EE7A0'

/** The central wireframe globe — the "floating object representing
 * technology/data" the brief asks for. Dense lat/long grid with a layered,
 * additive-blended glow (no postprocessing package needed — just three
 * copies of the wireframe at increasing scale / decreasing opacity, which
 * is how you fake a bloom halo without a real post-process pass) to read
 * as a bright neon sphere. Slowly spins on its Y-axis. */
export function CoreObject({ visibleRef, reducedMotion }: CoreObjectProps) {
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
        <meshBasicMaterial color={CORE_COLOR} transparent opacity={0.06} />
      </mesh>

      {/* Dense wireframe grid — the main visible shape */}
      <mesh>
        <sphereGeometry args={[1.4, 40, 26]} />
        <meshBasicMaterial
          color={CORE_COLOR}
          wireframe
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Two outer copies, scaled up and faded out, faking a bloom halo around the grid lines */}
      <mesh scale={1.035}>
        <sphereGeometry args={[1.4, 40, 26]} />
        <meshBasicMaterial
          color={CORE_COLOR}
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.4, 40, 26]} />
        <meshBasicMaterial
          color={CORE_COLOR}
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
