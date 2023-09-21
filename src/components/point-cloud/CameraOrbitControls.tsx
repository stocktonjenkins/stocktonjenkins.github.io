import React, { useRef } from 'react'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

const CameraOrbitControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree()
  const controls = useRef()

  // @ts-ignore
  useFrame(state => controls.current?.update())
  return (
    // @ts-ignore
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      maxDistance={4}
      minDistance={0.1}
    />
  )
}

export default CameraOrbitControls
