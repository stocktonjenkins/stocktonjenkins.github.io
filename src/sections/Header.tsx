import { Button, Stack, Typography } from '@mui/material'
import Statistic from '../components/info/Statistic'
import PhoneVideoPlayer from '../PhoneVideoPlayer'
import React from 'react'

type HeaderProps = {
  onExamplesClick: () => void
}

const Header: React.FC<HeaderProps> = props => {
  const { onExamplesClick } = props
  return (
    <Stack
      direction={'row'}
      spacing={12}
      minHeight={'75vh'}
      alignItems={'center'}
    >
      <Stack spacing={2} flex={1}>
        <Typography
          variant={'h2'}
          fontWeight={'bold'}
          color={theme => theme.palette.info.main}
        >
          Collecting point cloud data has never been easier.
        </Typography>
        <Typography
          variant={'subtitle1'}
          color={theme => theme.palette.info.dark}
        >
          Capture point cloud data for common objects of varying size on iPhone.
        </Typography>
        <Stack direction={'row'} spacing={2}>
          <Button variant={'outlined'} onClick={onExamplesClick}>
            View Examples
          </Button>
        </Stack>
        <Stack direction={'row'} spacing={4}>
          {[
            { stat: '100', description: 'Description of statistic' },
            { stat: '500k', description: 'Description of statistic' },
            { stat: '30s', description: 'Description of statistic' },
          ].map(stat => (
            <Statistic {...stat} />
          ))}
        </Stack>
      </Stack>
      <PhoneVideoPlayer />
    </Stack>
  )
}

export default Header
