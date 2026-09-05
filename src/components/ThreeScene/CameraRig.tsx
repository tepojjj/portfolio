import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  mouseRef: React.RefObject<{ x: number; y: number }>
  scrollRef: React.RefObject<number>
  reducedMotion: boolean
}

/** Drives subtle mouse parallax and a scroll-linked camera drift, without
 * ever handing control to the user (no orbit controls — this stays a backdrop). */
export function CameraRig({ mouseRef, scrollRef, reducedMotion }: CameraRigProps) {
  const { camera } = useThree()
  const basePosition = useRef(new THREE.Vector3(0, 0, 6))

  useFrame(() => {
    const mouse = mouseRef.current
    const scroll = scrollRef.current ?? 0

    const targetX = reducedMotion ? 0 : mouse.x * 0.5
    const targetY = reducedMotion ? 0 : -mouse.y * 0.3 + scroll * 0.6
    const targetZ = basePosition.current.z + scroll * 1.5

    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.position.z += (targetZ - camera.position.z) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}
