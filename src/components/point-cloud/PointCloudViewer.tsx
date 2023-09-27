import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import Statistic from '../info/Statistic'
import PointCloudContainer from './PointCloudContainer'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
  SectionTertiaryTypography,
} from '../styled/SectionHeaderTypography'
import { ScreenController } from '../layout/ScreenController'

const PointCloudViewer: React.FC = () => {
  return (
    <Grid container spacing={{ lg: 12, xs: 2 }}>
      <Grid item lg={4}>
        <Stack spacing={2} height={'100%'}>
          <SectionHeaderTypography fontWeight={'bold'}>
            A Growing Selection of Field-Standard Classes
          </SectionHeaderTypography>
          <Stack sx={{ flex: 1 }} spacing={1}>
            <SectionSubHeaderTypography
              variant={'subtitle2'}
              color={theme => theme.palette.info.dark}
            >
              Something important here Something important here Something
              important here Something important here
            </SectionSubHeaderTypography>
            <Stack direction={'row'} spacing={4}>
              {[
                { stat: '100', description: 'Unique Classes' },
                { stat: '500k', description: 'Captured Point Clouds' },
                { stat: '30s', description: 'Captured Images' },
              ].map(stat => (
                <Statistic key={stat.stat} {...stat} />
              ))}
            </Stack>
            <ScreenController.LargeScreen>
              <Typography
                variant={'body1'}
                sx={{ fontStyle: 'italic' }}
                color={theme => theme.palette.grey['400']}
              >
                Use the search bar to view examples point clouds of different
                classes we have collected thus far.
              </Typography>
            </ScreenController.LargeScreen>
          </Stack>
        </Stack>
      </Grid>
      <Grid item lg={8} sm={12} xs={12}>
        <PointCloudContainer />
      </Grid>
      <Grid item xs={12} sm={0}>
        <ScreenController.Mobile width={'100%'}>
          <Typography
            variant={'body2'}
            sx={{ fontStyle: 'italic' }}
            color={theme => theme.palette.grey['400']}
          >
            Use the search bar to view examples point clouds of different
            classes we have collected thus far.
          </Typography>
        </ScreenController.Mobile>
      </Grid>
    </Grid>
  )
}

export default PointCloudViewer
