import { ImageListItem, Box, Stack, Typography, Grid } from '@mui/material'
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
        <Carousel
          // navButtonsAlwaysVisible={isMobile}
          interval={6000}
        >
          <ImageListItem
            key={'model'}
            sx={{
              height: '100% !important',
            }}
          >
            <img src={'model_size.png'} />
          </ImageListItem>
          <ImageListItem
            key={'dataset'}
            sx={{
              height: '100% !important',
            }}
          >
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
            What is the pointr project?
          </SectionTertiaryTypography>
          <SectionHeaderTypography fontWeight={'bold'}>
            The 3D data desert is real.
          </SectionHeaderTypography>
          <SectionSubHeaderTypography color={theme => theme.palette.info.dark}>
            3D computer vision lags behind other applications of deep learning
            due to the expensive cost of collecting data. For this reason,
            dataset and model sizes are an order of magnitude smaller for point
            clouds, compared to images and language.
            <br />
            <br />
            The pointr project aims to build tools that scale the size 3D
            datasets and models at a much faster rate than done previously.
          </SectionSubHeaderTypography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default WhatIs
