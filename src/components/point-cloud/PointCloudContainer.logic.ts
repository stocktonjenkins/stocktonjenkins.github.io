import { useEffect, useState } from 'react'
import {
  ClassLabel,
  GetClassLabelsQuery,
  GetClassLabelsQueryVariables,
  GetPointCloudsByClassLabelQuery,
  GetPointCloudsByClassLabelQueryVariables,
} from '../../graphql/__generated__/graphql'
import { useLazyQuery } from '@apollo/client'
import { GET_CLASSES } from '../../graphql/query/GetClassLabels'
import { GET_POINT_CLOUDS_BY_CLASS_LABEL } from '../../graphql/query/GetPointCloudsByClassLabel'
import { PointCloudHelpers } from './point-cloud.helpers'

export const usePointCloudContainerLogic = () => {
  const [cloud, setCloud] = useState<THREE.Group | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>()
  const [selectedClass, setSelectedClass] = useState<ClassLabel>()
  const [loadingObjFile, setLoadingObjFile] = useState(false)
  const [getClassLabels, { data }] = useLazyQuery<
    GetClassLabelsQuery,
    GetClassLabelsQueryVariables
  >(GET_CLASSES, {
    fetchPolicy: 'cache-first',
  })
  const [
    getPointCloudsByClassLabel,
    { loading: loadingCloudPath },
  ] = useLazyQuery<
    GetPointCloudsByClassLabelQuery,
    GetPointCloudsByClassLabelQueryVariables
  >(GET_POINT_CLOUDS_BY_CLASS_LABEL)

  const handleDownloadObjFile = (path: string) => {
    setLoadingObjFile(true)
    PointCloudHelpers.downloadPointCloudFromStorage(path)
      .then(blob => {
        PointCloudHelpers.loadObjFile(blob)
          .then(cloud => {
            setCloud(cloud)
            setLoadingObjFile(false)
          })
          .catch(() => setLoadingObjFile(false))
      })
      .catch(() => setLoadingObjFile(false))
  }

  useEffect(() => {
    getClassLabels({
      variables: { searchTerm: searchTerm || '' },
    })
  }, [searchTerm])

  useEffect(() => {
    // Have a default value
    getClassLabels({
      variables: { searchTerm: 'Guitar' },
    })
      .then(res => {
        setSelectedClass(res.data?.classLabels[0] as ClassLabel)
      })
      .then(() => {
        getClassLabels({
          variables: { searchTerm: '' },
        })
      })
  }, [])

  useEffect(() => {
    if (selectedClass) {
      getPointCloudsByClassLabel({
        variables: {
          input: {
            classLabelId: selectedClass.id,
          },
        },
      }).then(paths => {
        const newest = paths.data?.pointCloudsByClass[0]?.bucketPath
        if (newest) {
          handleDownloadObjFile(newest)
        }
      })
    }
  }, [selectedClass])

  const classes = (data?.classLabels || []) as ClassLabel[]

  //@ts-ignore
  const geometry = cloud?.children[0]?.geometry
  geometry?.computeBoundingSphere()
  const center = geometry?.boundingSphere.center

  return {
    state: {
      searchTerm,
      setSearchTerm,
      selectedClass,
      setSelectedClass,
    },
    data: {
      geometry,
      center,
      loadingCloudPath,
      loadingObjFile,
      loadingPointCloud: loadingCloudPath || loadingObjFile,
      classes,
    },
  }
}
