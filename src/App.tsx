import React, { useRef } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import NavBar from './components/layout/NavBar'
import Section from './components/layout/Section'
import { FlexBox } from './components/layout/FlexBox'
import PointCloudViewer from './components/point-cloud/PointCloudViewer'
import About from './sections/About'
import How from './sections/How'
import Header from './sections/Header'
import WhatIs from './sections/WhatIs'

function App() {
  const projectRef = useRef<HTMLDivElement>()
  const dataRef = useRef<HTMLDivElement>()
  const aboutRef = useRef<HTMLDivElement>()

  return (
    <Box margin={-1}>
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
      <Section variant={'dark'} px={24} py={12}>
        <Header
          onExamplesClick={() =>
            dataRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </Section>
      <Section variant={'light'} px={12} py={12}>
        <WhatIs />
      </Section>
      <Section variant={'dark'} px={12} py={12} ref={projectRef}>
        <How />
      </Section>
      <Section variant={'light'} px={12} py={12} ref={dataRef}>
        <PointCloudViewer />
      </Section>
      <Section variant={'grey'} px={12} py={12}>
        <Stack direction={'row'} spacing={12} justifyContent={'center'}>
          <Paper
            sx={{
              flex: 1,
              height: 600,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <FlexBox.ColCenter height={'100%'} color={'white'}>
              Something important here
            </FlexBox.ColCenter>
          </Paper>
          <Stack spacing={2} flex={1} justifyContent={'center'}>
            <Typography
              variant={'subtitle2'}
              fontWeight={'bold'}
              color={theme => theme.palette.secondary.main}
            >
              Comparison to existing methods
            </Typography>
            <Typography variant={'h3'} fontWeight={'bold'}>
              It’s wicked fast.
            </Typography>
            <Typography
              variant={'subtitle1'}
              color={theme => theme.palette.info.dark}
            >
              Describe how the app is faster than existing methods since it is
              on a mobile device, rather than a lab.
            </Typography>
          </Stack>
        </Stack>
      </Section>
      <Section ref={aboutRef} variant={'dark'} px={24} py={12}>
        <About />
      </Section>
    </Box>
  )
}

export default App
