import { Box } from '@mui/material'
import { styled } from '../../theming/theme'

export const ScreenController = {
  Mobile: styled(Box)(({ theme }) => ({
    [theme.breakpoints.only('xs')]: {
      display: 'block',
    },
    [theme.breakpoints.not('xs')]: {
      display: 'none',
    },
  })),
  Tablet: styled(Box)(({ theme }) => ({
    [theme.breakpoints.only('md')]: {
      display: 'block',
    },
    [theme.breakpoints.not('md')]: {
      display: 'none',
    },
  })),
  Desktop: styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  })),
  NonDesktop: styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
      display: 'block',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  })),
  LargeScreen: styled(Box)(({ theme }) => ({
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.not('xs')]: {
      display: 'block',
    },
  })),
  SmallAndDown: styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  })),
  MediumAndUp: styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  })),
  None: styled(Box)(() => ({
    display: 'none',
  })),
  All: styled(Box)(() => ({
    display: 'block',
  })),
}
