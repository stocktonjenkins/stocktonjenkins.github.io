import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { ref, getBlob } from 'firebase/storage'
import { Firebase } from '../../Firebase'

const loadObjFile = async (blob: Blob | undefined) => {
  if (blob) {
    const loader = new OBJLoader()
    const blobString = await blob.text()
    const obj = loader.parse(blobString)
    return obj
  }
}

const downloadPointCloudFromStorage = async (
  bucketPath: string,
): Promise<Blob | undefined> => {
  try {
    const storageRef = ref(Firebase.Storage.obj, `gs://${bucketPath}`)
    const blob = await getBlob(storageRef)
    return blob
  } catch (error) {
    console.log('error downloading point cloud: ', error)
  }
  return undefined
}

export const PointCloudHelpers = {
  loadObjFile,
  downloadPointCloudFromStorage,
}
