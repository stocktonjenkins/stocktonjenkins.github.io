import { CustomIconProps } from './types'
import SvgIcon from '@mui/material/SvgIcon'
import React from 'react'

export const GradCapIcon: React.FC<CustomIconProps> = props => (
  <SvgIcon viewBox="0 0 24 24" fontSize={props.size}>
    <path
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"
      color={props.color}
    />
  </SvgIcon>
)

export default GradCapIcon
