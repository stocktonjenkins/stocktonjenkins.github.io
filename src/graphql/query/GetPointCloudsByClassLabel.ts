import { gql } from '@apollo/client'

export const GET_POINT_CLOUDS_BY_CLASS_LABEL = gql`
  query GetPointCloudsByClassLabel($input: PointCloudsByClassInput!) {
    pointCloudsByClass(input: $input) {
      bucketPath
    }
  }
`
