import { Button, Stack } from '@mui/material'
import PhoneVideoPlayer from '../PhoneVideoPlayer'
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
      direction={'column'}
      spacing={{ lg: 12, xs: 4 }}
      sx={theme => ({
        [theme.breakpoints.up('sm')]: {
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
          Collecting point cloud data has never been easier.
        </SectionHeaderTypography>
        <SectionSubHeaderTypography
          variant={'subtitle1'}
          color={theme => theme.palette.info.dark}
        >
          Capture point cloud data for common objects of varying size on iPhone.
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
