import React from 'react'
import { Paper, Stack, Typography, useTheme } from '@mui/material'
import { FlexBox } from '../layout/FlexBox'
import BoundingCubeIcon from '../icons/BoundingCube.icon'
import IconTile from '../tile/IconTile'

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
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Capture Point Cloud',
    summary:
      'Move the device around all sides of the object to capture point data.',
  },
]

const ScanSteps: React.FC = () => {
  const theme = useTheme()
  const color = theme.palette.secondary.main
  return (
    <Stack justifyContent={'space-between'} direction="row" spacing={12}>
      {steps(color).map(step => (
        <IconTile {...step} color={color} />
      ))}
    </Stack>
  )
}

export default ScanSteps
