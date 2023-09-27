import ReactPlayer from 'react-player'
import React, { useRef } from 'react'
import { Box } from '@mui/material'
import { FlexBox } from './components/layout/FlexBox'

const reduce = 0.4
const PhoneVideoPlayer: React.FC = () => {
  const size = {
    height: 888 * reduce,
    width: 1920 * reduce,
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <img
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 1,
        }}
        src={'iphone.png'}
      />
      <div style={{ borderRadius: 100, overflow: 'hidden' }}>
        <ReactPlayer
          pau
          style={{ padding: 16 }}
          {...size}
          // controls
          // playing
          loop
          url="example.mp4"
          muted
        />
      </div>
    </div>
  )
}

export default PhoneVideoPlayer
