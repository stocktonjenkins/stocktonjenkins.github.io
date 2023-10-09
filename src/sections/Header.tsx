import { Button, Stack, useMediaQuery } from '@mui/material'
import PhoneVideoPlayer from '../components/video/PhoneVideoPlayer'
import React from 'react'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
} from '../components/styled/SectionHeaderTypography'

type HeaderProps = {
  onExamplesClick: () => void
}

const Header: React.FC<HeaderProps> = props => {
  const { onExamplesClick } = props
  return (
    <Stack
      direction={{ xl: 'row', xs: 'column' }}
      spacing={{ lg: 12, md: 8, xs: 4 }}
      sx={theme => ({
        [theme.breakpoints.up('lg')]: {
          minHeight: '75vh',
        },
      })}
      alignItems={'center'}
    >
      <Stack spacing={2} flex={{ md: 1 }}>
        <SectionHeaderTypography
          fontWeight={'bold'}
          color={theme => theme.palette.info.main}
        >
          Pointr: A Project to Scale 3D Computer Vision.
        </SectionHeaderTypography>
        <SectionSubHeaderTypography
          variant={'subtitle1'}
          color={theme => theme.palette.info.dark}
        >
          The current state of 3D computer vision is challenging due to the lack
          of a large-scale, real-world dataset. In attempt to scale 3D computer
          vision in terms of data and model size, we introduce <b>Pointr</b>.
          <br />
          <b>Pointr</b> is a growing multi-modal dataset of common objects
          captured in their natural context via LiDAR on an AR-based iOS app.
        </SectionSubHeaderTypography>
        <Stack direction={'row'} spacing={2}>
          <Button variant={'outlined'} onClick={onExamplesClick}>
            View Examples
          </Button>
        </Stack>
      </Stack>
      <PhoneVideoPlayer />
    </Stack>
  )
}

export default Header
