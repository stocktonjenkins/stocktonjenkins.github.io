import {
  AppBar,
  Box,
  Button,
  Slide,
  Stack,
  Toolbar,
  useScrollTrigger,
  useTheme,
} from '@mui/material'
import React from 'react'

const HideOnScroll: React.FC<React.PropsWithChildren> = props => {
  const { children } = props
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {/*@ts-ignore*/}
      {children}
    </Slide>
  )
}

const NavBar: React.FC = () => {
  const theme = useTheme()
  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            bgcolor: theme.palette.background.paper,
            boxShadow: 'none',
            borderBottom: `2px solid ${theme.palette.grey['900']}`,
            py: 1,
            px: 12,
          }}
        >
          <Toolbar
            sx={{
              [theme.breakpoints.up('xs')]: {
                ...theme.view.row.between,
                p: theme.spacing(1, 4),
              },
              [theme.breakpoints.only('xs')]: {
                ...theme.view.row.between,
                p: theme.spacing(1, 2),
              },
            }}
            variant="dense"
          >
            <img src={'pointr.io.png'} style={{ width: 175 }} />
            <Stack spacing={4} direction={'row'}>
              <Button color={'info'}>Project</Button>
              <Button color={'info'}>Data</Button>
              <Button color={'info'}>About</Button>
              <Button variant={'outlined'}>Contact</Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar sx={{ pb: 0.2 }} />
    </>
  )
}

export default NavBar
