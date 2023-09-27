import { Button, Stack, Typography } from '@mui/material'
import ScanSteps from '../components/info/ScanSteps'
import PhoneVideoPlayer from '../PhoneVideoPlayer'
import { ChevronRight } from '@mui/icons-material'
import { FlexBox } from '../components/layout/FlexBox'
import React from 'react'

const How: React.FC = () => {
  return (
    <FlexBox.ColCenter>
      <Stack spacing={8}>
        <Stack spacing={4} textAlign={'center'}>
          <Typography
            variant={'h3'}
            fontWeight={'bold'}
            color={theme => theme.palette.info.main}
          >
            Scan objects quickly with iOS's AR & LiDAR technology
          </Typography>
          <Typography
            variant={'subtitle1'}
            color={theme => theme.palette.info.dark}
          >
            The Pointr app leverages Apple hardware and software to capture a
            point cloud of the space around you. The points are pruned down to a
            target object with an AR bounding cube that is set by the user.
          </Typography>
          <ScanSteps />
        </Stack>
        <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
          <PhoneVideoPlayer />
          <Button endIcon={<ChevronRight />}>See this example</Button>
        </Stack>
      </Stack>
    </FlexBox.ColCenter>
  )
}

export default How
