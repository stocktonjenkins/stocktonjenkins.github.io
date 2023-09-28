import React from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import Statistic from '../info/Statistic'
import PointCloudContainer from './PointCloudContainer'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
} from '../styled/SectionHeaderTypography'
import { ScreenController } from '../layout/ScreenController'
import { useQuery } from '@apollo/client'
import {
  GetScanScatsQuery,
  ScanStatisticsFragment,
} from '../../graphql/__generated__/graphql'
import { GET_SCAN_STATS } from '../../graphql/query/GetScanStats'

const formatLabel = (label: string): string => {
  switch (label) {
    case 'numPointClouds':
      return 'Captured Point clouds'
    case 'numImages':
      return 'Captured Images'
    case 'numClasses':
      return 'Unique Classes'
    default:
      return ''
  }
}

const PointCloudViewer: React.FC = () => {
  const { data } = useQuery<GetScanScatsQuery>(GET_SCAN_STATS)
  const stats = data?.scanStats as ScanStatisticsFragment | undefined

  return (
    <Grid container spacing={{ lg: 12, xs: 2 }}>
      <Grid item lg={4}>
        <Stack spacing={2} height={'100%'}>
          <SectionHeaderTypography fontWeight={'bold'}>
            A Growing Selection of Classes & Data
          </SectionHeaderTypography>
          <Stack spacing={2} flex={1}>
            <SectionSubHeaderTypography
              variant={'subtitle2'}
              color={theme => theme.palette.info.dark}
            >
              The preliminary goal is to deliver a publicly available dataset of
              point cloud and image pairing across <b>500</b> objects
              categories, <b>8x</b> the number of classes in the popular
              ModelNet40 benchmark.
            </SectionSubHeaderTypography>
            {stats && (
              <Stack direction={'row'} spacing={4}>
                {Object.entries(stats as Record<string, string | number>)
                  .filter(([key, _]) => (key as string) !== '__typename')
                  .map(([key, stat]) => (
                    <Statistic
                      key={key}
                      stat={stat as string}
                      description={formatLabel(key)}
                    />
                  ))}
              </Stack>
            )}
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
