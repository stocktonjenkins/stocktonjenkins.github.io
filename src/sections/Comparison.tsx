import { Paper, Stack, Typography, Grid } from '@mui/material'
import { FlexBox } from '../components/layout/FlexBox'
import React from 'react'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
  SectionTertiaryTypography,
} from '../components/styled/SectionHeaderTypography'

const Comparison: React.FC = () => {
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
        <Paper
          sx={{
            flex: 1,
            height: 600,
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <FlexBox.ColCenter height={'100%'} color={'white'}>
            Something important here
          </FlexBox.ColCenter>
        </Paper>
      </Grid>
      <Grid item lg={6} sm={12} xs={12}>
        <Stack spacing={2} flex={1} justifyContent={'center'}>
          <SectionTertiaryTypography
            variant={'subtitle2'}
            fontWeight={'bold'}
            color={theme => theme.palette.secondary.main}
          >
            Comparison to existing methods
          </SectionTertiaryTypography>
          <SectionHeaderTypography variant={'h3'} fontWeight={'bold'}>
            It’s wicked fast.
          </SectionHeaderTypography>
          <SectionSubHeaderTypography
            variant={'subtitle1'}
            color={theme => theme.palette.info.dark}
          >
            Describe how the app is faster than existing methods since it is on
            a mobile device, rather than a lab.
          </SectionSubHeaderTypography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Comparison
