import React from 'react'
import { Canvas } from '@react-three/fiber'
import CameraOrbitControls from './CameraOrbitControls'

type PointCloudProps = {
  geometry: any | null
  center: { x: number; y: number; z: number } | null
  color: string
}

const PointCloud: React.FC<PointCloudProps> = props => {
  const { geometry, color, center } = props
  return (
    <Canvas style={{ zIndex: 0 }} camera={{ fov: 65, position: [0, 0, 1.25] }}>
      <color attach="background" args={[0, 0, 0]} />
      <CameraOrbitControls />
      <ambientLight />
      {geometry && center && (
        <points position={[-center.x, -center.y, -center.z]}>
          <primitive object={geometry} attach="geometry" />
          <pointsMaterial color={color} size={0.002} />
        </points>
      )}
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  )
}

export default PointCloud
