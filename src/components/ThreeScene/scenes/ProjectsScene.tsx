import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

interface FrameDef {
  pos: [number, number, number]
  rot: number
  speed: number
  offset: number
  size: number
  color: string
}

function ProjectsMesh({ visibleRef, mouseRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const frameRefs = useRef<(THREE.Mesh | null)[]>([])

  const frames: FrameDef[] = useMemo(() => {
    const count = isMobile ? 5 : 8
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3.5,
        -1 - Math.random() * 3,
      ] as [number, number, number],
      rot: Math.random() * Math.PI,
      speed: 0.15 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2,
      size: 0.5 + Math.random() * 0.5,
      color: i % 2 === 0 ? '#3F6B46' : '#7C9471',
    }))
  }, [isMobile])

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta

    frames.forEach((def, i) => {
      const mesh = frameRefs.current[i]
      if (!mesh) return
      mesh.rotation.z += speed * def.speed * 0.3
      mesh.rotation.x += speed * def.speed * 0.15
      mesh.position.y = def.pos[1] + Math.sin(performance.now() * 0.0002 * def.speed + def.offset) * 0.25
    })

    if (groupRef.current) {
      const mouse = mouseRef.current
      const targetY = reducedMotion ? 0 : mouse.x * 0.15
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={0.8} color="#3F6B46" />
      {frames.map((def, i) => (
        <mesh
          key={i}
          ref={(el) => { frameRefs.current[i] = el }}
          position={def.pos}
          rotation={[0, 0, def.rot]}
        >
          <planeGeometry args={[def.size, def.size * 0.65]} />
          <meshBasicMaterial color={def.color} wireframe transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

/** Background scene for Projects: a loose field of drifting wireframe frames,
 * reading as scattered "systems" or screens without illustrating any one product. */
export function ProjectsScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 5]} lightweight>
      {(args) => <ProjectsMesh {...args} />}
    </SectionCanvas>
  )
}
