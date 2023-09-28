import { Button, Stack, Box } from '@mui/material'
import ScanSteps from '../components/info/ScanSteps'
import PhoneVideoPlayer from '../components/video/PhoneVideoPlayer'
import { ChevronRight } from '@mui/icons-material'
import { FlexBox } from '../components/layout/FlexBox'
import React from 'react'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
  SectionTertiaryTypography,
} from '../components/styled/SectionHeaderTypography'

const How: React.FC = () => {
  return (
    <FlexBox.ColCenter>
      <Stack spacing={{ lg: 8, sm: 2, xs: 2 }}>
        <Stack spacing={{ lg: 4, sm: 2, xs: 2 }} textAlign={'center'}>
          <SectionTertiaryTypography
            fontWeight={'bold'}
            color={theme => theme.palette.secondary.main}
          >
            How it's done
          </SectionTertiaryTypography>
          <SectionHeaderTypography
            fontWeight={'bold'}
            color={theme => theme.palette.info.main}
          >
            Scan objects quickly with AR & LiDAR technology in iOS
          </SectionHeaderTypography>
          <SectionSubHeaderTypography color={theme => theme.palette.info.dark}>
            The Pointr app leverages Apple hardware and software to capture a
            point cloud of the space around you. The points are pruned down to a
            target object with an AR bounding cube that is set by the user.
          </SectionSubHeaderTypography>
          <Box>
            <ScanSteps />
          </Box>
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
