import { gql } from '@apollo/client'

export const GET_CLASSES = gql`
  query GetClassLabels {
    classLabels {
      label
      numClouds
      numImages
    }
  }
`
