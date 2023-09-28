import {
  Button,
  ImageListItem,
  Stack,
  Typography,
  useTheme,
  Grid,
  Box,
} from '@mui/material'
import IconTile from '../components/tile/IconTile'
import React from 'react'
import BoundingCubeIcon from '../components/icons/BoundingCube.icon'
import { NavigationHelpers } from '../helpers/navigation.helpers'
import { MailOutline } from '@mui/icons-material'
import {
  SectionHeaderTypography,
  SectionSubHeaderTypography,
  SectionTertiaryTypography,
} from '../components/styled/SectionHeaderTypography'

const stockton = (color: string) => [
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: '4.0 GPA & Summa Cum Laude',
    summary:
      'Graduated Summa Cum Laude from Brigham Young University with a B.S in Computer Science in 2021.',
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
    <Grid container spacing={{ lg: 12, xs: 2 }}>
      <Grid item lg={7} sm={12} xs={12}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <SectionHeaderTypography
              fontWeight={'bold'}
              color={theme => theme.palette.info.main}
            >
              Get to know the author
            </SectionHeaderTypography>
            <SectionTertiaryTypography
              variant={'subtitle2'}
              fontWeight={'bold'}
              color={theme => theme.palette.secondary.main}
            >
              Stockton Jenkins
            </SectionTertiaryTypography>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <MailOutline
                sx={theme => ({ color: theme.palette.grey['400'] })}
              />
              <Typography
                variant={'body2'}
                color={theme => theme.palette.grey['400']}
              >
                stocktonjenkins@gmail.com
              </Typography>
            </Stack>
          </Stack>
          <Typography
            color={theme => theme.palette.info.dark}
            variant={'body1'}
          >
            Stockton has had tremendous academic success throughout his life.
            This is due to his passion for learning and problem solving, as well
            as his incredible work ethic. After spending a few years away from
            school, Stockton is now looking to maximize his education by
            pursuing a graduate degree.
            <br />
            <br />
            In his spare time, Stockton loves to play a number of musical
            instruments and spend time in the great out doors. He married the
            love of his life, Katherine, in November of 2022.
          </Typography>
          <Box>
            <Button variant={'outlined'} onClick={NavigationHelpers.navToCV}>
              View Stockton's CV
            </Button>
          </Box>
          <Box>
            <Grid container spacing={2}>
              {stockton(color).map(info => (
                <Grid
                  item
                  lg={6}
                  sm={12}
                  xs={12}
                  sx={theme => ({
                    [theme.breakpoints.up('sm')]: {
                      display: 'flex',
                    },
                  })}
                >
                  <IconTile
                    {...info}
                    color={color}
                    size={100}
                    sx={{ flex: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Grid>
      <Grid item lg={5} sm={12} xs={12}>
        <ImageListItem
          sx={{
            width: '100% !important',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <img src={'stockton.jpeg'} />
        </ImageListItem>
      </Grid>
    </Grid>
  )
}
export default About
