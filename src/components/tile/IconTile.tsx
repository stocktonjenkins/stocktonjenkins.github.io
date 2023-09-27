import { FlexBox } from '../layout/FlexBox'
import { CSSObject, Paper, Stack, Typography } from '@mui/material'
import React from 'react'

type IconTileProps = {
  icon: React.ReactNode
  title: string
  summary: string
  color: string
  size?: number
  sx?: CSSObject
}

const IconTile: React.FC<IconTileProps> = props => (
  <Paper
    sx={{
      flex: 1,
      p: 3,
      borderRadius: 2,
      ...props.sx,
    }}
  >
    <FlexBox.RowCenter sx={{ height: '100%' }}>
      <Stack spacing={1} justifyContent={'flex-start'} height={'100%'}>
        {props.icon}
        <Typography
          variant={'subtitle2'}
          textAlign={'left'}
          fontWeight={'bold'}
          color={props.color}
        >
          {props.title}
        </Typography>
        <Typography
          variant={'body1'}
          color={theme => theme.palette.common.white}
          textAlign={'left'}
          sx={{ flex: 1 }}
        >
          {props.summary}
        </Typography>
      </Stack>
    </FlexBox.RowCenter>
  </Paper>
)

export default IconTile
