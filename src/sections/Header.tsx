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
  const isLgOrAbove = useMediaQuery('(min-width: 1280px)')
  return (
    <Stack
      direction={isLgOrAbove ? 'row' : 'column'}
      spacing={{ lg: 12, md: 8, xs: 4 }}
      sx={theme => ({
        [theme.breakpoints.up('lg')]: {
          minHeight: '75vh',
          flexDirection: 'row',
        },
        [theme.breakpoints.down('lg')]: {
          flexDirection: 'column',
        },
      })}
      alignItems={'center'}
    >
      <Stack spacing={2} flex={{ md: 1 }}>
        <SectionHeaderTypography
          fontWeight={'bold'}
          color={theme => theme.palette.info.main}
        >
          Collecting point cloud data has never been easier.
        </SectionHeaderTypography>
        <SectionSubHeaderTypography
          variant={'subtitle1'}
          color={theme => theme.palette.info.dark}
        >
          The current state of 3D deep learning is challenging due to the lack
          of large-scale, real-world data set. To promote both deeper and
          broader research into 3D computer vision, we introduce Pointr.
          <br />
          Pointr is a growing multi-modal dataset with point cloud and images
          collected via LiDAR on iPhone.
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
