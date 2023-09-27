import { FlexBox } from '../layout/FlexBox'
import {
  CSSObject,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { SectionSubHeaderTypography } from '../styled/SectionHeaderTypography'

type IconTileProps = {
  icon: React.ReactNode
  title: string
  summary: string
  color: string
  size?: number
  sx?: CSSObject
}

const IconTile: React.FC<IconTileProps> = props => {
  const isMobile = useMediaQuery('(max-width:600px)')
  return (
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
          <SectionSubHeaderTypography
            textAlign={'left'}
            fontWeight={'bold'}
            color={props.color}
          >
            {props.title}
          </SectionSubHeaderTypography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color={theme => theme.palette.common.white}
            sx={{
              flex: 1,
              textAlign: 'left',
            }}
          >
            {props.summary}
          </Typography>
        </Stack>
      </FlexBox.RowCenter>
    </Paper>
  )
}

export default IconTile
