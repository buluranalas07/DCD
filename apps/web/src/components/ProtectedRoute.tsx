import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userProfile } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/signin" replace />
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
