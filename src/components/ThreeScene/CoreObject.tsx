import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoreObjectProps {
  visibleRef: React.RefObject<boolean>
  reducedMotion: boolean
}

/** The central wireframe globe — the "floating object representing
 * technology/data" the brief asks for. Slowly rotates (with a slight axial
 * tilt, globe-style) and breathes in scale. Toned down from the earlier
 * icosahedron version: lower opacity/emissive so it reads as a supporting
 * visual behind the headline rather than competing with it. */
export function CoreObject({ visibleRef, reducedMotion }: CoreObjectProps) {
  const wireRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    if (wireRef.current) {
      wireRef.current.rotation.y += speed * 0.12
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t.current * 0.6) * 0.03
      glowRef.current.scale.setScalar(scale)
      glowRef.current.rotation.y -= speed * 0.08
    }
  })

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.4, 24, 16]} />
        <meshBasicMaterial color="#6EE7A0" transparent opacity={0.04} />
      </mesh>
      {/* Earth-like axial tilt (~23.5°) so the latitude/longitude grid reads as a globe, not a ball */}
      <mesh ref={wireRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[1.4, 18, 12]} />
        <meshStandardMaterial
          color="#6EE7A0"
          wireframe
          emissive="#6EE7A0"
          emissiveIntensity={0.25}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}
