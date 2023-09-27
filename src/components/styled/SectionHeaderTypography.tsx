import { styled } from '../../theming/theme'
import { Typography } from '@mui/material'

export const SectionHeaderTypography = styled(Typography)(
  ({ theme, ...rest }) => ({
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.h3.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.subtitle1.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
  }),
)

export const SectionSubHeaderTypography = styled(Typography)(
  ({ theme, ...rest }) => ({
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.subtitle1.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.body1.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
  }),
)

export const SectionTertiaryTypography = styled(Typography)(
  ({ theme, ...rest }) => ({
    [theme.breakpoints.up('xs')]: {
      fontSize: theme.typography.subtitle2.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.body1.fontSize,
      fontFamily: 'IBM Plex Mono',
      ...rest,
    },
  }),
)
