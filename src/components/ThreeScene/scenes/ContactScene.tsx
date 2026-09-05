import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

function ContactMesh({ visibleRef, mouseRef, reducedMotion }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += speed * 0.15
      ring1Ref.current.rotation.x = 1.1 + Math.sin(t.current * 0.3) * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= speed * 0.1
      ring2Ref.current.rotation.x = 1.3 + Math.cos(t.current * 0.25) * 0.12
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t.current * 1.4) * 0.06
      coreRef.current.scale.setScalar(pulse)
    }
    if (groupRef.current) {
      const mouse = mouseRef.current
      const targetY = reducedMotion ? 0 : mouse.x * 0.2
      const targetX = reducedMotion ? 0 : mouse.y * 0.15
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[-1.8, 0, -1.5]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={1.1} color="#3ed9c4" />

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#3ed9c4" emissive="#3ed9c4" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring1Ref} rotation={[1.1, 0, 0]}>
        <torusGeometry args={[1.1, 0.015, 16, 96]} />
        <meshBasicMaterial color="#3ed9c4" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[1.3, 0, 0]}>
        <torusGeometry args={[1.4, 0.012, 16, 96]} />
        <meshBasicMaterial color="#e3a857" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

/** Background scene for Contact: a breathing core with two slow orbiting rings —
 * a quiet "open channel" visual behind the call-to-action copy. */
export function ContactScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 6]} lightweight>
      {(args) => <ContactMesh {...args} />}
    </SectionCanvas>
  )
}
