import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userProfile, profileLoading } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  // Show loading state while profile is being fetched to avoid flashing onboarding
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Redirect to onboarding if profile doesn't exist yet
  if (!userProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // Redirect away from onboarding if profile already exists
  if (userProfile && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
