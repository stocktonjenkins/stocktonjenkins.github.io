import React from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { FlexBox } from '../layout/FlexBox'
import SearchBar from '../SearchBar'
import PointCloud from './PointCloud'

import { ClassLabel } from '../../graphql/__generated__/graphql'
import CircularProgress from '@mui/material/CircularProgress'
import { usePointCloudContainerLogic } from './PointCloudContainer.logic'
import { ScreenController } from '../layout/ScreenController'

const PointCloudContainer: React.FC = props => {
  const theme = useTheme()
  // const { cloudBlob } = props

  const {
    state: { setSearchTerm, selectedClass, setSelectedClass },
    data: {
      geometry,
      center,
      classes,
      loadingPointCloud,
      loadingCloudPath,
      loadingObjFile,
    },
  } = usePointCloudContainerLogic()

  const SelectedClass = selectedClass && (
    <Stack>
      <Typography color={theme.palette.secondary.main} fontWeight={'bold'}>
        {selectedClass.label}
      </Typography>
      <Typography
        variant={'body2'}
        color={theme.palette.secondary.main}
        fontWeight={'bold'}
      >
        Captured Clouds: {selectedClass?.numClouds}
      </Typography>
      <Typography
        variant={'body2'}
        color={theme.palette.secondary.main}
        fontWeight={'bold'}
      >
        Captured Images: {selectedClass.numImages}
      </Typography>
    </Stack>
  )

  return (
    <Box
      sx={{
        width: '100%',
        height: '75vh',
        position: 'relative',
      }}
    >
      <PointCloud
        geometry={geometry}
        center={center}
        color={theme.palette.secondary.main}
      />
      {loadingPointCloud && (
        <Box
          style={{
            position: 'absolute',
            justifyContent: 'center',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack alignContent={'center'} spacing={2}>
            <CircularProgress
              color="secondary"
              size={75}
              sx={{ alignSelf: 'center' }}
            />
            <Typography color={'secondary'} sx={{ alignSelf: 'center' }}>
              {loadingObjFile
                ? 'Loading .obj File...'
                : loadingCloudPath
                ? 'Fetching...'
                : ''}
            </Typography>
          </Stack>
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          zIndex: 1,
          width: '100%',
        }}
      >
        <FlexBox.RowBetween px={4}>
          <ScreenController.LargeScreen>
            {selectedClass ? SelectedClass : <Box />}
          </ScreenController.LargeScreen>
          <SearchBar<ClassLabel>
            loading={false}
            options={classes}
            handleSelectOption={setSelectedClass}
            handleUpdateSearchTerm={setSearchTerm}
          />
        </FlexBox.RowBetween>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 32,
          zIndex: 1,
        }}
      >
        <ScreenController.Mobile>{SelectedClass}</ScreenController.Mobile>
      </Box>
    </Box>
  )
}

export default PointCloudContainer
