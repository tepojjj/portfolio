import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoreObjectProps {
  visibleRef: React.RefObject<boolean>
  reducedMotion: boolean
}

/** The central wireframe icosahedron — the "floating object representing
 * technology/data" the brief asks for. Slowly rotates and breathes in scale. */
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
      wireRef.current.rotation.x += speed * 0.05
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
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#3F6B46" transparent opacity={0.05} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color="#3F6B46"
          wireframe
          emissive="#3F6B46"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  )
}
