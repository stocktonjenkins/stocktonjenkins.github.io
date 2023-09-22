import { getStorage } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MSG_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  POINT_CLOUD_STORAGE_BUCKET,
} = process.env

// const firebaseConfig = {
//   apiKey: 'AIzaSyA5c_831TTu0gEwH5iZQLwVGaGSfroCY80',
//   authDomain: 'erudite-tome-279803.firebaseapp.com',
//   projectId: 'erudite-tome-279803',
//   storageBucket: 'erudite-tome-279803.appspot.com',
//   messagingSenderId: '23138885419',
//   appId: '1:23138885419:web:2d418b1e4e4924162b6f6e',
//   measurementId: 'G-4W15G9GLH6',
// }

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MSG_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

export const objStorage = getStorage(app, `gs://${POINT_CLOUD_STORAGE_BUCKET}`)

// const analytics = getAnalytics(app)

export const Firebase = {
  Storage: {
    obj: objStorage,
  },
}
