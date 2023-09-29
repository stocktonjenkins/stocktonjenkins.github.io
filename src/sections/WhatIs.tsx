import { ImageListItem, Stack, Grid, Typography } from '@mui/material'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
  SectionTertiaryTypography,
} from '../components/styled/SectionHeaderTypography'

const WhatIs: React.FC = () => {
  return (
    <Grid
      container
      spacing={{ lg: 12, xs: 2 }}
      justifyContent={'center'}
      sx={theme => ({
        [theme.breakpoints.only('xs')]: {
          flexDirection: 'column-reverse',
        },
      })}
    >
      <Grid item lg={6} sm={12} xs={12}>
        <Carousel interval={10000}>
          <ImageListItem
            key={'model'}
            sx={{
              height: '100% !important',
              textAlign: 'center',
            }}
          >
            <Typography color={theme => theme.palette.info.dark}>
              Figure: Log scale comparison of model sizes across modalities
            </Typography>
            <img src={'model_size.png'} />
          </ImageListItem>
          <ImageListItem
            key={'dataset'}
            sx={{
              height: '100% !important',
              textAlign: 'center',
            }}
          >
            <Typography color={theme => theme.palette.info.dark}>
              Figure: Log scale comparison of dataset sizes across modalities
            </Typography>
            <img src={'dataset_size.png'} />
          </ImageListItem>
        </Carousel>
      </Grid>
      <Grid item lg={6} sm={12} xs={12}>
        <Stack spacing={2} flex={1} justifyContent={'center'}>
          <SectionTertiaryTypography
            fontWeight={'bold'}
            color={theme => theme.palette.secondary.main}
          >
            What Is The Pointr Project?
          </SectionTertiaryTypography>
          <SectionHeaderTypography fontWeight={'bold'}>
            The 3D Data Desert Is Real.
          </SectionHeaderTypography>
          <SectionSubHeaderTypography color={theme => theme.palette.info.dark}>
            3D computer vision lags behind other applications of deep learning
            due to the time-consuming nature of collecting data. For this
            reason, dataset and model sizes are an order of magnitude smaller
            for 3D, compared to other popular modalities (i.e. image and
            language).
            <br />
            <br />
            The <b>Pointr</b> project aims to build tools that scale the size of
            3D datasets and 3D vision models at a much faster rate than done
            previously.
          </SectionSubHeaderTypography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default WhatIs
