import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const loadObjFile = async (blob: Blob | null) => {
  if (blob) {
    const loader = new OBJLoader()
    const blobString = await blob.text()
    const obj = loader.parse(blobString)
    return obj
  }
}

export const PointCloudHelpers = {
  loadObjFile,
}
