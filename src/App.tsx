import React from 'react'
import './App.css'
import { useQuery } from '@apollo/client'
import { GET_CLASSES } from './graphql/query/GetClassLabels'
import { GetClassLabelsQuery } from './graphql/__generated__/graphql'
import {
  Box,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

function App() {
  const { data } = useQuery<GetClassLabelsQuery>(GET_CLASSES)

  return (
    <div className="App">
      <header className="App-header">
        <TableContainer
          component={Paper}
          sx={{ flex: 1 / 2, maxWidth: 650, padding: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Class Name</StyledTableCell>
                <StyledTableCell># of Point Clouds</StyledTableCell>
                <StyledTableCell># of Images</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.classLabels.map(label => (
                <TableRow key={label.label}>
                  <TableCell component="th" scope="row">
                    {label.label}
                  </TableCell>
                  <TableCell>{label.numClouds}</TableCell>
                  <TableCell>{label.numImages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div>
  )
}

export default App
