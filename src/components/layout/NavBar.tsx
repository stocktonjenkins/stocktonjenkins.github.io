import {
  AppBar,
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

type NavBarProps = {
  onClickProject: () => void
  onClickData: () => void
  onClickAbout: () => void
}

const NavBar: React.FC<NavBarProps> = props => {
  const { onClickProject, onClickAbout, onClickData } = props
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
              <Button color={'info'} onClick={onClickProject}>
                Project
              </Button>
              <Button color={'info'} onClick={onClickData}>
                Data
              </Button>
              <Button variant={'outlined'} onClick={onClickAbout}>
                About
              </Button>
              {/*<Button variant={'outlined'}>Contact</Button>*/}
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar sx={{ pb: 0.2 }} />
    </>
  )
}

export default NavBar
