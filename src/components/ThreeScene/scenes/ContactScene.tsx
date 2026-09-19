import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

/** Wireframe torus with visible tube segments (radialSegments kept low) so the
 * surface reads as a gridded "ladder" rather than a smooth ring — this is
 * what gives the reference atom-model image its texture. */
function GridRing({
  radius,
  tube,
  color,
  opacity,
  rotation,
}: {
  radius: number
  tube: number
  color: string
  opacity: number
  rotation: [number, number, number]
}) {
  return (
    <mesh rotation={rotation}>
      <torusGeometry args={[radius, tube, 8, 72]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

function ContactMesh({ visibleRef, mouseRef, reducedMotion }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const ring3Ref = useRef<THREE.Group>(null)
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
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += speed * 0.08
      ring3Ref.current.rotation.y = 0.5 + Math.sin(t.current * 0.22) * 0.15
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t.current * 1.4) * 0.06
      coreRef.current.scale.setScalar(pulse)
      coreRef.current.rotation.y += speed * 0.1
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
      <pointLight position={[3, 2, 4]} intensity={1.1} color="#6EE7A0" />

      {/* Dense gridded core, same technique as the Hero globe */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 28, 20]} />
        <meshBasicMaterial color="#6EE7A0" wireframe transparent opacity={0.5} depthWrite={false} />
      </mesh>

      <group ref={ring1Ref}>
        <GridRing radius={1.1} tube={0.05} color="#6EE7A0" opacity={0.45} rotation={[1.1, 0, 0]} />
      </group>
      <group ref={ring2Ref}>
        <GridRing radius={1.4} tube={0.045} color="#C7E38A" opacity={0.4} rotation={[1.3, 0, 0]} />
      </group>
      <group ref={ring3Ref}>
        <GridRing radius={1.25} tube={0.04} color="#6EE7A0" opacity={0.35} rotation={[0.3, 1.4, 0]} />
      </group>
    </group>
  )
}

/** Background scene for Contact: a dense wireframe core with three orbiting
 * gridded rings at different tilts — an "atom" motif fitting for a section
 * about opening a connection. Quiet enough to sit behind the call-to-action
 * copy rather than compete with it. */
export function ContactScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 6]} lightweight>
      {(args) => <ContactMesh {...args} />}
    </SectionCanvas>
  )
}
