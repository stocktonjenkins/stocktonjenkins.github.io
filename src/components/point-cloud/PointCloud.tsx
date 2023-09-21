import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PointCloudHelpers } from './point-cloud.helpers'
import * as fiber from '@react-three/fiber'
import { Box } from '@mui/material'
import { Canvas, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import CameraOrbitControls from './CameraOrbitControls'

type PointCloudProps = {
  cloudBlob?: Blob
}

const PointCloud: React.FC<PointCloudProps> = props => {
  const { cloudBlob } = props
  // const [cloud, setCloud] = useState<THREE.Group | undefined>(undefined)
  const cloud = useLoader(OBJLoader, 'guitar-1.obj')

  // useEffect(() => {
  //   ;(async () => {
  //     const response = await fetch('clouds/test.obj')
  //     const blob = await response.blob()
  //     PointCloudHelpers.loadObjFile(blob).then(setCloud)
  //   })()
  // }, [])

  //@ts-ignore
  const geometry = cloud?.children[0]?.geometry
  geometry?.computeBoundingSphere()
  const center = geometry?.boundingSphere.center

  if (!center || !cloud || !geometry) {
    return null
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 800,
        position: 'relative',
      }}
    >
      <Canvas camera={{ fov: 70, position: [0, 0, 2] }}>
        <color attach="background" args={[0, 0, 0]} />
        <CameraOrbitControls />
        <ambientLight />
        <points position={[-center.x, -center.y, -center.z]}>
          <primitive object={geometry} attach="geometry" />
          <pointsMaterial color={'orange'} size={0.002} />
        </points>
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </Box>
  )
}

export default PointCloud
