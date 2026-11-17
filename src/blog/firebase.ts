import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { initializeFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Firebase web config is not a secret: access is enforced by firestore.rules
// and storage.rules. Values come from .env.local (see BLOG.md).
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

/** UID of the only account allowed to write. Mirrors ADMIN_UID in the rules files. */
export const ADMIN_UID = process.env.REACT_APP_BLOG_ADMIN_UID || ''

export const firebaseConfigured = Boolean(config.apiKey && config.projectId)

let app: FirebaseApp | undefined
let _auth: Auth | undefined
let _db: Firestore | undefined
let _storage: FirebaseStorage | undefined

function ensureApp(): FirebaseApp {
  if (!firebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env.local and fill in your Firebase web config.',
    )
  }
  if (!app) app = initializeApp(config)
  return app
}

export const auth = () => (_auth ??= getAuth(ensureApp()))
// Optional fields (e.g. a reference without a URL) are left undefined; Firestore
// rejects undefined values unless told to drop them.
export const db = () => (_db ??= initializeFirestore(ensureApp(), { ignoreUndefinedProperties: true }))
export const storage = () => (_storage ??= getStorage(ensureApp()))
