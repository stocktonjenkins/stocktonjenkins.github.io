import {
  AppBar,
  Box,
  Button,
  Collapse,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  useScrollTrigger,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { ScreenController } from './ScreenController'
import PointrIcon from '../icons/Pointr.icon'
import { FlexBox } from './FlexBox'

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
  const [show, setShow] = useState<boolean>(false)

  return (
    <>
      <HideOnScroll>
        <AppBar
          sx={{
            bgcolor: theme.palette.background.paper,
            boxShadow: 'none',
            borderBottom: `2px solid ${theme.palette.grey['900']}`,
            py: { sm: 1, xs: 0 },
            px: { sm: 12, xs: 0 },
          }}
        >
          <Toolbar
            sx={{
              [theme.breakpoints.up('xs')]: {
                ...theme.view.row.between,
                p: theme.spacing(1, 4),
              },
            }}
            variant="dense"
          >
            <ScreenController.LargeScreen flex={1}>
              <FlexBox.RowBetween width={'100%'}>
                <img src={'pointr.io.png'} style={{ width: 175 }} />
                <Stack
                  spacing={4}
                  direction={'row'}
                  justifyContent={'flex-end'}
                  flex={1}
                >
                  <Button color={'info'} onClick={onClickProject}>
                    Project
                  </Button>
                  <Button color={'info'} onClick={onClickData}>
                    Data
                  </Button>
                  <Button variant={'outlined'} onClick={onClickAbout}>
                    About
                  </Button>
                </Stack>
              </FlexBox.RowBetween>
            </ScreenController.LargeScreen>
            <ScreenController.Mobile flex={1}>
              <FlexBox.Col>
                <FlexBox.RowRight>
                  <IconButton onClick={() => setShow(!show)}>
                    <PointrIcon
                      color={theme.palette.common.white}
                      size={'large'}
                    />
                  </IconButton>
                </FlexBox.RowRight>
                <Collapse
                  in={show}
                  sx={{
                    ...theme.view.col.center,
                  }}
                >
                  <Stack spacing={2} sx={theme.view.col.center} pb={2}>
                    <Button
                      color={'info'}
                      onClick={() => {
                        onClickProject()
                        setShow(false)
                      }}
                    >
                      Project
                    </Button>
                    <Button
                      color={'info'}
                      onClick={() => {
                        onClickData()
                        setShow(false)
                      }}
                    >
                      Data
                    </Button>
                    <Button
                      variant={'outlined'}
                      onClick={() => {
                        onClickAbout()
                        setShow(false)
                      }}
                    >
                      About
                    </Button>
                  </Stack>
                </Collapse>
              </FlexBox.Col>
            </ScreenController.Mobile>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar sx={{ pb: 0.2 }} />
    </>
  )
}

export default NavBar
