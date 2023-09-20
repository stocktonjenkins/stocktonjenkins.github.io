import { Box } from '@mui/material'
import { styled } from '../../theming/theme'

export const FlexBox = {
  Col: styled(Box)(({ theme }) => theme.view.col.std),
  ColRight: styled(Box)(({ theme }) => theme.view.col.right),
  ColLeft: styled(Box)(({ theme }) => theme.view.col.left),
  ColCenter: styled(Box)(({ theme }) => theme.view.col.center),
  ColBetween: styled(Box)(({ theme }) => theme.view.col.between),
  Row: styled(Box)(({ theme }) => theme.view.row.std),
  RowRight: styled(Box)(({ theme }) => theme.view.row.right),
  RowLeft: styled(Box)(({ theme }) => theme.view.row.left),
  RowCenter: styled(Box)(({ theme }) => theme.view.row.center),
  RowBetween: styled(Box)(({ theme }) => theme.view.row.between),
}
