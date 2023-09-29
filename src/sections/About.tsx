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
import { NavigationHelpers } from '../helpers/navigation.helpers'
import { MailOutline } from '@mui/icons-material'
import {
  SectionHeaderTypography,
  SectionTertiaryTypography,
} from '../components/styled/SectionHeaderTypography'
import GradCapIcon from '../components/icons/GradCap.icon'
import PublishedIcon from '../components/icons/Published.icon'
import ResearchIcon from '../components/icons/Research.icon'
import CodeIcon from '../components/icons/Code.icon'

const stockton = (color: string) => [
  {
    icon: <GradCapIcon color={color} size={'large'} />,
    title: '4.0 GPA & Summa Cum Laude',
    summary:
      'Graduated Summa Cum Laude from Brigham Young University with a B.S in Computer Science in 2021.',
  },
  {
    icon: <PublishedIcon color={color} size={'large'} />,
    title: 'Published Papers',
    summary: `Three peer reviewed papers (and a fourth currently under review) in several notable conferences, including AAAi and WACV.`,
  },
  {
    icon: <ResearchIcon color={color} size={'large'} />,
    title: 'Research & Academic Interests',
    summary:
      'Scaling 3D computer vision and its applications, including data; foundational 3D models; mobile-friendly algorithms and models',
  },
  {
    icon: <CodeIcon color={color} size={'large'} />,
    title: 'Experienced Engineer',
    summary:
      'Experienced in Python, TypeScript, Java, Swift, and SQL. Knowledgeable with tools & frameworks like Pytorch, Django, ARKit/RealityKit, React/React Native, and Google Cloud Platform.',
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
              Get To Know The Author
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
            Stockton graduated with a 4.0 (Summa Cum Laude) from Brigham Young
            University with a Bachelor's degree in Computer Science. During his
            time at BYU, Stockton was apart of <i>METAL</i> labs, working on 3D
            computer vision models and their applications. Over the past several
            years, Stockton has also been involved in building a successful AI
            startup.
            <br />
            <br />
            In his spare time, Stockton loves to play a number of musical
            instruments and spend time in the great outdoors. He married the
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
                  key={info.title}
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
