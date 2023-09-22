import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Paper } from '@mui/material'
import { useEffect } from 'react'

type SearchBarProps<T> = {
  options: T[]
  loading: boolean
  handleUpdateSearchTerm: (term: string) => void
  handleSelectOption: (opt: T) => void
}

const SearchBar = <T,>(props: React.PropsWithChildren<SearchBarProps<T>>) => {
  const { options, loading, handleSelectOption, handleUpdateSearchTerm } = props
  const [open, setOpen] = React.useState(false)

  return (
    <Autocomplete<T>
      id="search-bar"
      onInputChange={(_, newTerm) => handleUpdateSearchTerm(newTerm)}
      sx={theme => ({
        width: 300,
        bgcolor: theme.palette.grey['100'],
        borderRadius: 2,
      })}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
        handleUpdateSearchTerm('')
      }}
      // isOptionEqualToValue={(option, value) => option.title === value.title}
      // getOptionLabel={option => option.title}
      PaperComponent={props => (
        <Paper
          {...props}
          sx={theme => ({ bgcolor: theme.palette.grey['100'] })}
        />
      )}
      options={options}
      loading={loading}
      onChange={(_, selectedOption) => {
        if (selectedOption) {
          handleSelectOption(selectedOption)
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Classes"
          variant={'filled'}
          color={'secondary'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchBar as typeof SearchBar
