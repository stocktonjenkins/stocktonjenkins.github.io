import React from 'react'
import { Box, BoxProps } from '@mui/material'
import FadeInContent from './FadeInContent/FadeInContent'

type SectionProps = {
  variant: 'light' | 'dark' | 'grey'
} & BoxProps

const Section: React.FC<React.PropsWithChildren<SectionProps>> = props => {
  const { children, variant, ...BoxProps } = props
  return (
    <FadeInContent>
      {/*@ts-ignore*/}
      <Box
        //@ts-ignore
        {...BoxProps}
        //@ts-ignore
        sx={theme => ({
          ...BoxProps.sx,
          bgcolor:
            variant === 'dark'
              ? theme.palette.background.default
              : variant === 'grey'
              ? theme.palette.grey['200']
              : theme.palette.common.white,
        })}
      >
        {children}
      </Box>
    </FadeInContent>
  )
}

export default Section
