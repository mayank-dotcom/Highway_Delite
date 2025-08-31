"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-hook'

interface UserFlowHandlerProps {
  children: React.ReactNode
  mode: 'signup' | 'signin'
}

export function UserFlowHandler({ children }: UserFlowHandlerProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isChecking] = useState(false)

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && user) {
      window.location.href = '/dashboard'
      return
    }
  }, [user, isAuthenticated])

  // Show loading while checking authentication status
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, don't render children (will redirect)
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
