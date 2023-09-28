import React, { useRef } from 'react'
import { Box, BoxProps } from '@mui/material'
import NavBar from './components/layout/NavBar'
import Section from './components/layout/Section'
import PointCloudViewer from './components/point-cloud/PointCloudViewer'
import About from './sections/About'
import How from './sections/How'
import Header from './sections/Header'
import WhatIs from './sections/WhatIs'
import Comparison from './sections/Comparison'

function App() {
  const projectRef = useRef<HTMLDivElement>()
  const dataRef = useRef<HTMLDivElement>()
  const aboutRef = useRef<HTMLDivElement>()

  const px = (lgvar: 'lg' | 'reg'): BoxProps['px'] => ({
    lg: lgvar === 'lg' ? 24 : 12,
    xs: 6,
  })
  const py: BoxProps['py'] = {
    lg: 12,
    xs: 6,
  }

  const shared = (lgvar: 'lg' | 'reg') => ({
    px: px(lgvar),
    py,
  })

  return (
    <Box margin={{ lg: -1, xs: -2 }}>
      <NavBar
        onClickProject={() =>
          projectRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        onClickData={() =>
          dataRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        onClickAbout={() =>
          aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      <Section variant={'dark'} {...shared('lg')}>
        <Header
          onExamplesClick={() =>
            dataRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </Section>
      <Section variant={'light'} {...shared('reg')}>
        <WhatIs />
      </Section>
      <Section variant={'dark'} {...shared('reg')} ref={projectRef}>
        <How />
      </Section>
      <Section variant={'light'} {...shared('reg')} ref={dataRef}>
        <PointCloudViewer />
      </Section>
      {/*<Section variant={'grey'} {...shared('reg')}>*/}
      {/*  <Comparison />*/}
      {/*</Section>*/}
      <Section ref={aboutRef} variant={'dark'} {...shared('lg')}>
        <About />
      </Section>
    </Box>
  )
}

export default App
