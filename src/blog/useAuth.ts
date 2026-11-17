import { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { ADMIN_UID, auth, firebaseConfigured } from './firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(firebaseConfigured)
  useEffect(() => {
    if (!firebaseConfigured) return
    return onAuthStateChanged(auth(), u => {
      setUser(u)
      setLoading(false)
    })
  }, [])
  return { user, loading, isAdmin: Boolean(user && ADMIN_UID && user.uid === ADMIN_UID) }
}

export const signIn = () => signInWithPopup(auth(), new GoogleAuthProvider())
export const signOutUser = () => signOut(auth())
