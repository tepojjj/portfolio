import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

function ExperienceMesh({ visibleRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = isMobile ? 70 : 140

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = -1 - Math.random() * 3
      spd[i] = 0.15 + Math.random() * 0.3
    }
    return [pos, spd]
  }, [count])

  useFrame((_, delta) => {
    if (!visibleRef.current || !pointsRef.current || reducedMotion) return
    const geo = pointsRef.current.geometry
    const arr = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = arr.getY(i) + speeds[i] * delta
      if (y > 4) y = -4
      arr.setY(i, y)
    }
    arr.needsUpdate = true
  })

  return (
    <group position={[2.2, 0, -1]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#6EE7A0"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.55}
        />
      </Points>
    </group>
  )
}

/** Background scene for Experience: slow-rising particles echoing the timeline's
 * upward growth, offset to the right so the timeline copy stays clear. */
export function ExperienceScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 6]} lightweight>
      {(args) => <ExperienceMesh {...args} />}
    </SectionCanvas>
  )
}
