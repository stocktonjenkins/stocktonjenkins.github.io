import React from 'react'
import { Grid, useTheme } from '@mui/material'
import BoundingCubeIcon from '../icons/BoundingCube.icon'
import IconTile from '../tile/IconTile'
import PointrIcon from '../icons/Pointr.icon'

type ScanStep = {
  icon: React.ReactNode
  title: string
  summary: string
}

const steps = (color: string): ScanStep[] => [
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Select Class',
    summary:
      'Choose the class of the object you will scan. Find an object that matches the selected class.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Capture Images',
    summary:
      'Use the camera shutter to take pictures of the object from multiple angles.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Set Bounding Cube',
    summary:
      'Set an AR bounding cube around the object to filter out noisy points.',
  },
  {
    icon: <PointrIcon color={color} size={'large'} />,
    title: 'Capture Point Cloud',
    summary:
      'Move the device around all sides of the object to capture point data.',
  },
]

const ScanSteps: React.FC = () => {
  const theme = useTheme()
  const color = theme.palette.secondary.main
  return (
    <Grid
      container
      justifyContent={'space-between'}
      direction="row"
      spacing={2}
    >
      {steps(color).map(step => (
        <Grid
          item
          xs={12}
          sm={3}
          sx={theme => ({
            [theme.breakpoints.up('sm')]: {
              flex: 1,
              display: 'flex',
            },
          })}
        >
          <IconTile {...step} color={color} sx={{ flex: 1 }} />
        </Grid>
      ))}
    </Grid>
  )
}

export default ScanSteps
