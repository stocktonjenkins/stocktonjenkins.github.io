import { CustomIconProps } from './types'
import SvgIcon from '@mui/material/SvgIcon'
import React from 'react'

export const CodeIcon: React.FC<CustomIconProps> = props => (
  <SvgIcon viewBox="0 0 24 24" fontSize={props.size}>
    <path
      d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
      fill={props.color}
    />
  </SvgIcon>
)

export default CodeIcon
