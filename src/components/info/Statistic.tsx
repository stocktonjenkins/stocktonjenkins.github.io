import React from 'react'
import { Stack, Typography } from '@mui/material'

type StatisticProps = {
  stat: string
  description: string
}

const Statistic: React.FC<StatisticProps> = props => {
  const { stat, description } = props
  return (
    <Stack spacing={1}>
      <Typography variant={'h4'} color={theme => theme.palette.primary.dark}>
        {stat}
      </Typography>
      <Typography variant={'body1'} color={theme => theme.palette.info.dark}>
        {description}
      </Typography>
    </Stack>
  )
}

export default Statistic
