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
    title: 'Set Bounding Cube',
    summary: 'Explanation of the step with just a little more detail.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Set Bounding Cube',
    summary: 'Explanation of the step with just a little more detail.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Set Bounding Cube',
    summary: 'Explanation of the step with just a little more detail.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Set Bounding Cube',
    summary: 'Explanation of the step with just a little more detail.',
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
