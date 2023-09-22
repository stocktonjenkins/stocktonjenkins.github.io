import { gql } from '@apollo/client'

export const GET_CLASSES = gql`
  query GetClassLabels($searchTerm: String) {
    classLabels(searchTerm: $searchTerm) {
      ...ClassLabel
    }
  }

  fragment ClassLabel on ClassLabel {
    id
    label
    numClouds
    numImages
  }
`
