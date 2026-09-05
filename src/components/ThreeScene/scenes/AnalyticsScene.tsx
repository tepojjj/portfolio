import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

interface BarDef {
  x: number
  z: number
  baseHeight: number
  speed: number
  offset: number
  color: string
}

function AnalyticsMesh({ visibleRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const barRefs = useRef<(THREE.Mesh | null)[]>([])
  const groupRef = useRef<THREE.Group>(null)
  const t = useRef(0)

  const bars: BarDef[] = useMemo(() => {
    const cols = isMobile ? 5 : 8
    return Array.from({ length: cols }, (_, i) => ({
      x: (i - (cols - 1) / 2) * 0.45,
      z: 0,
      baseHeight: 0.4 + Math.random() * 1.1,
      speed: 0.5 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '#e3a857' : '#3ed9c4',
    }))
  }, [isMobile])

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    bars.forEach((def, i) => {
      const mesh = barRefs.current[i]
      if (!mesh) return
      const h = def.baseHeight + Math.sin(t.current * def.speed + def.offset) * 0.3
      mesh.scale.y = Math.max(0.15, h)
      mesh.position.y = mesh.scale.y / 2
    })

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.08) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.8, -2]} rotation={[0.15, 0, 0]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 4, 4]} intensity={0.9} color="#3ed9c4" />
      {bars.map((def, i) => (
        <mesh key={i} ref={(el) => { barRefs.current[i] = el }} position={[def.x, 0.5, def.z]}>
          <boxGeometry args={[0.22, 1, 0.22]} />
          <meshStandardMaterial
            color={def.color}
            emissive={def.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Background scene for Analytics: a row of breathing 3D bars, a quiet echo of the
 * real charts in front of it rather than a competing visualization. */
export function AnalyticsScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 6]} lightweight>
      {(args) => <AnalyticsMesh {...args} />}
    </SectionCanvas>
  )
}
