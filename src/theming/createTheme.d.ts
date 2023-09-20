import { CSSObject } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface ThemeOptions {
    view: {
      flex: CSSObject
      row: {
        std: CSSObject
        center: CSSObject
        right: CSSObject
        left: CSSObject
        between: CSSObject
      }
      col: {
        std: CSSObject
        center: CSSObject
        right: CSSObject
        left: CSSObject
        between: CSSObject
      }
    }
  }

  interface Theme {
    view: {
      flex: CSSObject
      row: {
        std: CSSObject
        center: CSSObject
        right: CSSObject
        left: CSSObject
        between: CSSObject
      }
      col: {
        std: CSSObject
        center: CSSObject
        right: CSSObject
        left: CSSObject
        between: CSSObject
      }
    }
  }
}
