import {
  Button,
  ImageListItem,
  Stack,
  Typography,
  useTheme,
  Box,
} from '@mui/material'
import IconTile from '../components/tile/IconTile'
import React from 'react'
import BoundingCubeIcon from '../components/icons/BoundingCube.icon'
import { NavigationHelpers } from '../helpers/navigation.helpers'
import { MailOutline } from '@mui/icons-material'

const stockton = (color: string) => [
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: '4.0 GPA & Summa Cum Laude',
    summary:
      'Graduated Summa Cum Laude from Brigham Young University with a B.S in Computer Science in 2021. Also attended the University of Utah for two years with a 4.0 GPA.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Published Papers',
    summary: `Three peer reviewed papers in several notable conferences, including AAAi and WACV.`,
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Research & Academic Interests',
    summary:
      'Scaling 3D deep learning and its applications, including data; foundational 3D models; mobile-friendly algorithms and models',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Experienced Engineer',
    summary: 'Explanation of the step with just a little more detail.',
  },
]

const About: React.FC = () => {
  const theme = useTheme()
  const color = theme.palette.secondary.main

  return (
    <Stack
      direction={'row'}
      spacing={12}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Stack spacing={2} flex={1} justifyContent={'center'}>
        <Stack spacing={0.5}>
          <Typography
            variant={'h3'}
            fontWeight={'bold'}
            color={theme => theme.palette.info.main}
          >
            Get to know the author
          </Typography>
          <Typography
            variant={'subtitle2'}
            fontWeight={'bold'}
            color={theme => theme.palette.secondary.main}
          >
            Stockton Jenkins
          </Typography>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <MailOutline sx={theme => ({ color: theme.palette.grey['400'] })} />
            <Typography
              variant={'body2'}
              color={theme => theme.palette.grey['400']}
            >
              stocktonjenkins@gmail.com
            </Typography>
          </Stack>
        </Stack>
        <Typography variant={'body1'} color={theme => theme.palette.info.dark}>
          <Typography>
            Stockton has had tremendous success at every academic institution
            where has studied. This is due to his passion for learning and
            problem solving, as well as his incredible work ethic. After
            spending a few years away from school, Stockton is now looking to
            maximize his education by pursuing a graduate degree.
          </Typography>
          <Typography mt={1}>
            In his spare time, Stockton loves to play a number of musical
            instruments and spend time in the great out doors. He married the
            love of his life, Katherine, in November of 2022.
          </Typography>
        </Typography>
        <Box>
          <Button variant={'outlined'} onClick={NavigationHelpers.navToCV}>
            View Stockton's CV
          </Button>
        </Box>
        <Stack spacing={2}>
          <Stack direction={'row'} spacing={2}>
            {stockton(color)
              .splice(0, 2)
              .map(info => (
                <IconTile {...info} color={color} size={100} sx={{ flex: 1 }} />
              ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            {stockton(color)
              .splice(2)
              .map(info => (
                <IconTile {...info} color={color} size={100} sx={{ flex: 1 }} />
              ))}
          </Stack>
        </Stack>
      </Stack>

      <ImageListItem
        sx={{
          maxWidth: '40%',
          height: '100% !important',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <img src={'stockton.jpeg'} />
      </ImageListItem>
      {/*<Paper*/}
      {/*  sx={{*/}
      {/*    flex: 1,*/}
      {/*    height: 700,*/}
      {/*    alignContent: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <FlexBox.ColCenter height={'100%'} color={'white'}>*/}
      {/*    Image of Stockton*/}
      {/*  </FlexBox.ColCenter>*/}
      {/*</Paper>*/}
    </Stack>
  )
}

// @ts-ignore
export default React.forwardRef(About) as typeof About
