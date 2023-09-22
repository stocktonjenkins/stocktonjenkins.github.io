import React from 'react'
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import NavBar from './components/layout/NavBar'
import Section from './components/layout/Section'
import { FlexBox } from './components/layout/FlexBox'
import Statistic from './components/info/Statistic'
import ScanSteps from './components/info/ScanSteps'
import IconTile from './components/tile/IconTile'
import BoundingCubeIcon from './components/icons/BoundingCube.icon'
import { ChevronRight, RestartAlt } from '@mui/icons-material'
import PointCloud from './components/point-cloud/PointCloud'
import PointCloudViewer from './components/point-cloud/PointCloudViewer'

const FILL = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis elit a dolor tincidunt, ut lacinia lorem rhoncus. Vestibulum eget mi eu libero congue ullamcorper. Nullam convallis lacus a dolor cursus, id bibendum quam volutpat.
`

const stockton = (color: string) => [
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: '4.0 GPA & Summa Cum Laude',
    summary:
      'Graduated Summa Cum Laude from Brigham Young University with a B.S in Computer Science.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Published Papers',
    summary:
      '3 peer reviewed papers in several notable conferences, including AAAi.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Research & Academic Interests',
    summary: 'Explanation of the step with just a little more detail.',
  },
  {
    icon: <BoundingCubeIcon color={color} size={'large'} />,
    title: 'Something else here',
    summary: 'Explanation of the step with just a little more detail.',
  },
]

function App() {
  const theme = useTheme()
  const color = theme.palette.secondary.main

  // return <PointCloud />
  return (
    <Box margin={-1}>
      <NavBar />
      <Section variant={'dark'} px={36} py={12}>
        <Stack
          direction={'row'}
          spacing={12}
          minHeight={'75vh'}
          alignItems={'center'}
        >
          <Stack spacing={2} flex={1}>
            <Typography
              variant={'h3'}
              fontWeight={'bold'}
              color={theme => theme.palette.info.main}
            >
              Unlocking the power of mobile for point cloud data capture.
            </Typography>
            <Typography
              variant={'subtitle1'}
              color={theme => theme.palette.info.dark}
            >
              {FILL}
            </Typography>
            <Stack direction={'row'} spacing={2}>
              <Button variant={'outlined'}>View Examples</Button>
              <Button variant={'outlined'}>Contact Author</Button>
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
          <Box>
            <img style={{ height: 400 }} src={'iphone.png'} />
            <Typography color={'white'}>
              This will be just screen recordings of the point cloud scan step
            </Typography>
          </Box>
        </Stack>
      </Section>
      <Section variant={'light'} px={12} py={12}>
        <Stack direction={'row'} spacing={12} justifyContent={'center'}>
          <Paper
            sx={{
              flex: 1,
              height: 600,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <FlexBox.ColCenter height={'100%'} color={'white'}>
              Something important here
            </FlexBox.ColCenter>
          </Paper>
          <Stack spacing={2} flex={1} justifyContent={'center'}>
            <Typography
              variant={'subtitle2'}
              fontWeight={'bold'}
              color={theme => theme.palette.secondary.main}
            >
              What is the pointr project?
            </Typography>
            <Typography variant={'h3'} fontWeight={'bold'}>
              The 3D data desert is real.
            </Typography>
            <Typography
              variant={'subtitle1'}
              color={theme => theme.palette.info.dark}
            >
              Give a summary of the “data desert” for 3D computer vision. Pointr
              is an attempt to solve that problem.
            </Typography>
            <Box>
              <Button variant={'outlined'}>View Examples</Button>
            </Box>
          </Stack>
        </Stack>
      </Section>
      <Section variant={'dark'} px={12} py={12}>
        <FlexBox.ColCenter>
          <Stack spacing={12}>
            <Stack spacing={6} textAlign={'center'}>
              <Typography
                variant={'h3'}
                fontWeight={'bold'}
                color={theme => theme.palette.info.main}
              >
                How it's done...
              </Typography>
              <Typography
                variant={'subtitle1'}
                color={theme => theme.palette.info.dark}
              >
                Something really important should go here.
              </Typography>
              <ScanSteps />
            </Stack>
            <FlexBox.ColCenter>
              <img style={{ height: 500 }} src={'iphone.png'} />
              <Stack direction={'row'} spacing={2} pt={2}>
                <Button endIcon={<RestartAlt />}>Start video over</Button>
                <Button endIcon={<ChevronRight />}>See this example</Button>
              </Stack>
            </FlexBox.ColCenter>
          </Stack>
        </FlexBox.ColCenter>
      </Section>
      <Section variant={'light'} px={12} py={12}>
        <PointCloudViewer />
      </Section>
      <Section variant={'grey'} px={12} py={12}>
        <Stack direction={'row'} spacing={12} justifyContent={'center'}>
          <Paper
            sx={{
              flex: 1,
              height: 600,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <FlexBox.ColCenter height={'100%'} color={'white'}>
              Something important here
            </FlexBox.ColCenter>
          </Paper>
          <Stack spacing={2} flex={1} justifyContent={'center'}>
            <Typography
              variant={'subtitle2'}
              fontWeight={'bold'}
              color={theme => theme.palette.secondary.main}
            >
              Comparison to existing methods
            </Typography>
            <Typography variant={'h3'} fontWeight={'bold'}>
              It’s wicked fast.
            </Typography>
            <Typography
              variant={'subtitle1'}
              color={theme => theme.palette.info.dark}
            >
              Describe how the app is faster than existing methods since it is
              on a mobile device, rather than a lab.
            </Typography>
          </Stack>
        </Stack>
      </Section>
      <Section variant={'dark'} px={36} py={12}>
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
            </Stack>
            <Typography
              variant={'body1'}
              color={theme => theme.palette.info.dark}
            >
              {FILL}
            </Typography>
            <Box>
              <Button variant={'outlined'}>Contact Stockton</Button>
            </Box>
            <Stack spacing={2}>
              <Stack direction={'row'} spacing={2}>
                {stockton(color)
                  .splice(0, 2)
                  .map(info => (
                    <IconTile
                      {...info}
                      color={color}
                      size={100}
                      sx={{ flex: 1 }}
                    />
                  ))}
              </Stack>
              <Stack direction={'row'} spacing={2}>
                {stockton(color)
                  .splice(2)
                  .map(info => (
                    <IconTile
                      {...info}
                      color={color}
                      size={100}
                      sx={{ flex: 1 }}
                    />
                  ))}
              </Stack>
            </Stack>
          </Stack>
          <Paper
            sx={{
              flex: 1,
              height: 700,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <FlexBox.ColCenter height={'100%'} color={'white'}>
              Image of Stockton
            </FlexBox.ColCenter>
          </Paper>
        </Stack>
      </Section>
    </Box>
  )
}

export default App
