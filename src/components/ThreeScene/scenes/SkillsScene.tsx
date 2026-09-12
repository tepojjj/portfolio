import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

interface NodeDef {
  basePos: THREE.Vector3
  speed: number
  offset: number
  size: number
  color: string
}

const COLORS = ['#6EE7A0', '#C7E38A', '#6EE7A0', '#C7E38A', '#6EE7A0']

function SkillsMesh({ visibleRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  const lineRef = useRef<THREE.LineSegments>(null)
  const t = useRef(0)

  const nodes: NodeDef[] = useMemo(() => {
    const count = isMobile ? 5 : 7
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const r = 2.1 + (i % 3) * 0.4
      return {
        basePos: new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle * 1.3) * 1.1, Math.sin(angle) * r),
        speed: 0.12 + (i % 3) * 0.05,
        offset: i * 1.3,
        size: 0.07 + (i % 3) * 0.015,
        color: COLORS[i % COLORS.length],
      }
    })
  }, [isMobile])

  const linePositions = useMemo(() => new Float32Array(nodes.length * 2 * 3), [nodes.length])
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [linePositions])

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    const positions: THREE.Vector3[] = []
    nodes.forEach((def, i) => {
      const wobble = Math.sin(t.current * def.speed + def.offset)
      const pos = def.basePos.clone()
      pos.y += wobble * 0.3
      pos.x += Math.cos(t.current * def.speed * 0.7 + def.offset) * 0.2
      positions.push(pos)
      const mesh = nodeRefs.current[i]
      if (mesh) mesh.position.copy(pos)
    })

    // Connect each node to the next, forming a loose constellation ring.
    if (lineRef.current) {
      const arr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute
      positions.forEach((pos, i) => {
        const next = positions[(i + 1) % positions.length]
        arr.setXYZ(i * 2, pos.x, pos.y, pos.z)
        arr.setXYZ(i * 2 + 1, next.x, next.y, next.z)
      })
      arr.needsUpdate = true
    }

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += speed * 0.06
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={0.9} color="#6EE7A0" />
      {nodes.map((def, i) => (
        <mesh key={i} ref={(el) => { nodeRefs.current[i] = el }} position={def.basePos}>
          <icosahedronGeometry args={[def.size, 0]} />
          <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.6} />
        </mesh>
      ))}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#6EE7A0" transparent opacity={0.18} />
      </lineSegments>
    </group>
  )
}

/** Background scene for Skills: a slowly rotating constellation of nodes echoing the
 * "technology ecosystem" framing of the section copy. */
export function SkillsScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 6.5]} lightweight>
      {(args) => <SkillsMesh {...args} />}
    </SectionCanvas>
  )
}
