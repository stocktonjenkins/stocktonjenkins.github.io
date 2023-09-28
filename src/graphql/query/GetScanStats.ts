import { gql } from '@apollo/client'

export const GET_SCAN_STATS = gql`
  query GetScanScats {
    scanStats {
      ...ScanStatistics
    }
  }
  fragment ScanStatistics on ScanStats {
    numClasses
    numImages
    numPointClouds
  }
`
