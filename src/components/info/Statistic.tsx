import React from 'react'
import { Stack, Typography } from '@mui/material'
import { SectionHeaderTypography } from '../styled/SectionHeaderTypography'

type StatisticProps = {
  stat: string
  description: string
}

const Statistic: React.FC<StatisticProps> = props => {
  const { stat, description } = props
  return (
    <Stack spacing={{ sm: 1, xs: 0 }}>
      <SectionHeaderTypography color={theme => theme.palette.primary.dark}>
        {stat}
      </SectionHeaderTypography>
      <Typography variant={'body1'} color={theme => theme.palette.info.dark}>
        {description}
      </Typography>
    </Stack>
  )
}

export default Statistic
