import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import PointCloud from './PointCloud'
import Statistic from '../info/Statistic'
import PointCloudContainer from './PointCloudContainer'

const PointCloudViewer: React.FC = () => {
  return (
    <Grid container spacing={12}>
      <Grid item lg={4}>
        <Stack spacing={2} height={'100%'}>
          <Typography variant={'h3'} fontWeight={'bold'}>
            A Growing Selection of Field-Standard Classes
          </Typography>
          <Stack sx={{ flex: 1 }} spacing={1}>
            <Typography
              variant={'subtitle2'}
              color={theme => theme.palette.info.dark}
            >
              Something important here Something important here Something
              important here Something important here Something important here
              Something important here Something important here
            </Typography>
            <Stack direction={'row'} spacing={4}>
              {[
                { stat: '100', description: 'Unique Classes' },
                { stat: '500k', description: 'Captured Point Clouds' },
                { stat: '30s', description: 'Captured Images' },
              ].map(stat => (
                <Statistic key={stat.stat} {...stat} />
              ))}
            </Stack>
          </Stack>
          <Typography
            variant={'body1'}
            sx={{ fontStyle: 'italic' }}
            color={theme => theme.palette.grey['400']}
          >
            Use the search bar to view examples point clouds of different
            classes we have collected thus far.
          </Typography>
        </Stack>
      </Grid>
      <Grid item lg={8}>
        <PointCloudContainer />
      </Grid>
    </Grid>
  )
}

export default PointCloudViewer
