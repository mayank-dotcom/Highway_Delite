"use client"

import { useAuth } from "@/lib/auth-hook"

export default function DebugPage() {
  const { user, isAuthenticated, isLoading, authMethod } = useAuth()

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug (OTP Only)</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Status:</h2>
          <p className="text-gray-600">{isLoading ? 'Loading...' : (isAuthenticated ? 'Authenticated' : 'Not authenticated')}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Authentication Method:</h2>
          <p className="text-gray-600">{authMethod || 'None'}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">User:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Local Storage:</h2>
          <div className="space-y-2">
            <p>Token: {typeof window !== 'undefined' && localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
            <p>User: {typeof window !== 'undefined' && localStorage.getItem('user') ? 'Present' : 'Missing'}</p>
            <p>Keep Logged In: {typeof window !== 'undefined' && localStorage.getItem('keepLoggedIn') ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Environment:</h2>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}
