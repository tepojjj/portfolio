import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { SectionCanvas, type SceneRenderArgs } from '@/components/ThreeScene/SectionCanvas'

function FooterMesh({ visibleRef, reducedMotion, isMobile }: SceneRenderArgs) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = isMobile ? 40 : 80

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.5
      arr[i * 3 + 2] = -1 - Math.random() * 2
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!visibleRef.current || !pointsRef.current || reducedMotion) return
    pointsRef.current.rotation.y += delta * 0.01
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#3F6B46"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  )
}

/** Footer background: a very sparse, near-static particle drift. Deliberately the
 * quietest scene on the page, since the footer's job is to close, not perform. */
export function FooterScene() {
  return (
    <SectionCanvas cameraPosition={[0, 0, 5]} lightweight>
      {(args) => <FooterMesh {...args} />}
    </SectionCanvas>
  )
}
