import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

interface BlockDef {
  pos: [number, number, number]
  size: number
  speed: number
  offset: number
  color: string
}

function ServicesMesh({ visibleRef, mouseRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const blockRefs = useRef<(THREE.Mesh | null)[]>([])

  const blocks: BlockDef[] = useMemo(() => {
    const count = isMobile ? 4 : 6
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        pos: [Math.cos(angle) * 2.4, Math.sin(angle * 0.7) * 1.2, Math.sin(angle) * 2.4 - 2] as [
          number,
          number,
          number,
        ],
        size: 0.28 + (i % 2) * 0.14,
        speed: 0.2 + (i % 3) * 0.08,
        offset: i * 1.1,
        color: i % 2 === 0 ? '#3ed9c4' : '#e3a857',
      }
    })
  }, [isMobile])

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta

    blocks.forEach((def, i) => {
      const mesh = blockRefs.current[i]
      if (!mesh) return
      mesh.rotation.x += speed * def.speed
      mesh.rotation.y += speed * def.speed * 0.7
      mesh.position.y = def.pos[1] + Math.sin(performance.now() * 0.0003 * def.speed + def.offset) * 0.2
    })

    if (groupRef.current) {
      const mouse = mouseRef.current
      const targetY = reducedMotion ? 0 : mouse.x * 0.2
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={0.8} color="#e3a857" />
      {blocks.map((def, i) => (
        <mesh key={i} ref={(el) => { blockRefs.current[i] = el }} position={def.pos}>
          <boxGeometry args={[def.size, def.size, def.size]} />
          <meshStandardMaterial
            color={def.color}
            wireframe
            emissive={def.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Background scene for Services: small modular wireframe cubes drifting around the
 * grid of service cards, suggesting composable building blocks. */
export function ServicesScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 5.5]} lightweight>
      {(args) => <ServicesMesh {...args} />}
    </SectionCanvas>
  )
}
