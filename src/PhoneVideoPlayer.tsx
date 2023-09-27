import ReactPlayer from 'react-player'
import React, { useRef } from 'react'
import { useMediaQuery } from '@mui/material'

const PhoneVideoPlayer: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const reduce = isMobile ? 0.15 : 0.4

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
          height: '100%',
          position: 'absolute',
          zIndex: 1,
        }}
        src={'iphone.png'}
      />
      <div style={{ borderRadius: isMobile ? 30 : 100, overflow: 'hidden' }}>
        <ReactPlayer
          pau
          style={{ padding: isMobile ? 7 : 18 }}
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
