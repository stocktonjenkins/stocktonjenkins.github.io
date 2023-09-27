import { ImageListItem, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import Carousel from 'react-material-ui-carousel'

const WhatIs: React.FC = () => {
  return (
    <Stack direction={'row'} spacing={12} justifyContent={'center'}>
      <Box flex={1}>
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
      </Box>
      <Stack spacing={2} flex={1} justifyContent={'center'}>
        <Typography
          variant={'subtitle2'}
          fontWeight={'bold'}
          color={theme => theme.palette.secondary.main}
        >
          What is the pointr project?
        </Typography>
        <Typography variant={'h3'} fontWeight={'bold'}>
          The 3D data desert is real.
        </Typography>
        <Typography
          variant={'subtitle1'}
          color={theme => theme.palette.info.dark}
        >
          <Typography
            variant={'subtitle1'}
            color={theme => theme.palette.info.dark}
          >
            3D computer vision lags behind other applications of deep learning
            due to the expensive cost of collecting data. For this reason,
            dataset and model sizes are an order of magnitude smaller for point
            cloud, compared to image and language.
          </Typography>
          <Typography
            variant={'subtitle1'}
            mt={1}
            color={theme => theme.palette.info.dark}
          >
            The pointr project aims to build tools that scale the size 3D
            datasets and models at a much faster rate than done previously.
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  )
}

export default WhatIs
