import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DataNodesProps {
  visibleRef: React.RefObject<boolean>
  reducedMotion: boolean
}

interface NodeDef {
  radius: number
  speed: number
  offset: number
  tilt: number
  size: number
  color: string
}

const NODE_DEFS: NodeDef[] = [
  { radius: 2.6, speed: 0.18, offset: 0, tilt: 0.3, size: 0.09, color: '#C7E38A' },
  { radius: 3.1, speed: -0.14, offset: 2.1, tilt: -0.5, size: 0.07, color: '#6EE7A0' },
  { radius: 2.3, speed: 0.22, offset: 4.2, tilt: 0.6, size: 0.06, color: '#6EE7A0' },
  { radius: 3.4, speed: -0.1, offset: 1.2, tilt: -0.2, size: 0.08, color: '#C7E38A' },
  { radius: 2.8, speed: 0.16, offset: 5.4, tilt: 0.15, size: 0.05, color: '#edf1f5' },
]

/** Small orbiting nodes with connecting lines back to the core — reads as a
 * lightweight data/store network rather than decorative sparkle. */
export function DataNodes({ visibleRef, reducedMotion }: DataNodesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  const lineRefs = useRef<(THREE.Line | null)[]>([])
  const t = useRef(0)

  const linePositions = useMemo(
    () => NODE_DEFS.map(() => new Float32Array([0, 0, 0, 0, 0, 0])),
    []
  )

  useFrame((_, delta) => {
    if (!visibleRef.current) return
    const speed = reducedMotion ? 0 : delta
    t.current += speed

    NODE_DEFS.forEach((def, i) => {
      const angle = t.current * def.speed + def.offset
      const x = Math.cos(angle) * def.radius
      const z = Math.sin(angle) * def.radius
      const y = Math.sin(angle * 1.3 + def.offset) * def.tilt

      const mesh = nodeRefs.current[i]
      if (mesh) mesh.position.set(x, y, z)

      const line = lineRefs.current[i]
      if (line) {
        const positions = line.geometry.attributes.position as THREE.BufferAttribute
        positions.setXYZ(1, x, y, z)
        positions.needsUpdate = true
      }
    })

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += speed * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {NODE_DEFS.map((def, i) => (
        <mesh key={i} ref={(el) => { nodeRefs.current[i] = el }}>
          <sphereGeometry args={[def.size, 16, 16]} />
          <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.6} />
        </mesh>
      ))}
      {NODE_DEFS.map((def, i) => (
        <line key={`line-${i}`} ref={(el) => { lineRefs.current[i] = el as unknown as THREE.Line }}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions[i], 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={def.color} transparent opacity={0.25} />
        </line>
      ))}
    </group>
  )
}
