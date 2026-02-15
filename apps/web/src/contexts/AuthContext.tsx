import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { UserProfile } from '@repo/shared'

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      setProfileLoading(true)
      const profileDoc = await getDoc(doc(db, 'users', uid, 'profile', 'data'))
      if (profileDoc.exists()) {
        setUserProfile(profileDoc.data() as UserProfile)
      } else {
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      setUserProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (currentUser) {
      await fetchProfile(currentUser.uid)
    }
  }, [currentUser, fetchProfile])

  const signup = async (email: string, password: string, displayName: string) => {
    setProfileLoading(true)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
      setCurrentUser({ ...userCredential.user })
    }
  }

  const login = async (email: string, password: string) => {
    setProfileLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    setProfileLoading(true)
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    setProfileLoading(true)
    await signOut(auth)
    setUserProfile(null)
    setProfileLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      // If user exists, we will fetch profile, so ensure loading is true
      if (user) {
        setProfileLoading(true)
        setCurrentUser(user)
        await fetchProfile(user.uid)
      } else {
        setCurrentUser(null)
        setUserProfile(null)
        setProfileLoading(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [fetchProfile])

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    profileLoading, // Export this
    signup,
    login,
    loginWithGoogle,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
