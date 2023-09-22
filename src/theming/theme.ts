import { createTheme, CSSObject, ThemeOptions } from '@mui/material'
import { createStyled } from '@mui/system'
import { Colors } from './Colors'

const DisplayFlexRowBase: CSSObject = {
  display: 'flex',
  flexDirection: 'row',
}

const DisplayFlexColumnBase: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
}

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      ...Colors.PRIMARY,
      dark: Colors.PRIMARY.accent,
      contrastText: Colors.WHITE,
    },
    secondary: Colors.SECONDARY,
    // black: Colors.TERTIARY,
    grey: {
      50: Colors.GRAY_50,
      100: Colors.GRAY_100,
      200: Colors.GRAY_200,
      300: Colors.GRAY_300,
      400: Colors.GRAY_400,
      500: Colors.GRAY_500,
      600: Colors.GRAY_600,
      700: Colors.GRAY_700,
      800: Colors.GRAY_800,
      900: Colors.GRAY_900,
    },
    info: {
      main: Colors.GRAY_100,
      dark: Colors.BLACK.accent,
    },
    background: {
      default: '#141415',
      paper: Colors.BLACK.main,
    },
    common: {
      black: Colors.BLACK.main,
      white: Colors.WHITE,
    },
  },
  view: {
    flex: {
      display: 'flex',
    },
    row: {
      std: DisplayFlexRowBase,
      center: {
        ...DisplayFlexRowBase,
        justifyContent: 'center',
        alignItems: 'center',
      },
      right: {
        ...DisplayFlexRowBase,
        justifyContent: 'right',
        alignItems: 'center',
      },
      left: {
        ...DisplayFlexRowBase,
        justifyContent: 'left',
        alignItems: 'center',
      },
      between: {
        ...DisplayFlexRowBase,
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
    col: {
      std: DisplayFlexColumnBase,
      center: {
        ...DisplayFlexColumnBase,
        justifyContent: 'center',
        alignItems: 'center',
      },
      right: {
        ...DisplayFlexColumnBase,
        justifyContent: 'center',
        alignItems: 'right',
      },
      left: {
        ...DisplayFlexColumnBase,
        justifyContent: 'center',
        alignItems: 'left',
      },
      between: {
        ...DisplayFlexColumnBase,
        justifyContent: 'center',
        alignItems: 'space-between',
      },
    },
  },
  typography: {
    h1: {
      fontSize: 64,
      fontFamily: 'IBM Plex Mono',
    },
    h2: {
      fontSize: 48,
      fontFamily: 'IBM Plex Mono',
    },
    h3: {
      fontSize: 40,
      fontFamily: 'IBM Plex Mono',
    },
    h4: {
      fontSize: 32,
      fontFamily: 'IBM Plex Mono',
    },
    subtitle1: {
      fontSize: 24,
      fontFamily: 'IBM Plex Mono',
    },
    subtitle2: {
      fontSize: 20,
      fontFamily: 'IBM Plex Mono',
    },
    body1: {
      fontSize: 14,
      fontFamily: 'IBM Plex Mono',
    },
    body2: {
      fontSize: 12,
      fontFamily: 'IBM Plex Mono',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: 'IBM Plex Mono',
          fontSize: 16,
          fontWeight: '400',
          borderRadius: 8,
        }),
      },
    },
  },
}

export const theme = createTheme(themeOptions)
export const styled = createStyled({ defaultTheme: theme })
