import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

function AboutMesh({ visibleRef, mouseRef, reducedMotion }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const knotRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    if (knotRef.current) {
      knotRef.current.rotation.x += speed * 0.1
      knotRef.current.rotation.y += speed * 0.16
    }
    if (groupRef.current) {
      const mouse = mouseRef.current
      const targetX = reducedMotion ? 0 : mouse.y * 0.2
      const targetY = reducedMotion ? 0 : mouse.x * 0.25
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[1.6, 0, -1]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={1} color="#6EE7A0" />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color="#C7E38A" />
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.05, 0.32, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#6EE7A0"
          wireframe
          emissive="#6EE7A0"
          emissiveIntensity={0.35}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

/** Lazily-loaded background scene for the About section: a wireframe torus knot,
 * tucked to one side so it reads as texture rather than competing with the copy. */
export function AboutScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 7]} lightweight>
      {(args) => <AboutMesh {...args} />}
    </SectionCanvas>
  )
}
