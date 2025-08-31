"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/hdlogo.png" alt="HD Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold tracking-tight text-black">HD</span>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-lg font-semibold text-red-800 mb-2">Authentication Error</h1>
          
          {error && (
            <p className="text-sm text-red-600 mb-4">
              {error === "OAuthSignin" && "Error occurred during OAuth sign-in"}
              {error === "OAuthCallback" && "Error occurred during OAuth callback"}
              {error === "OAuthCreateAccount" && "Error occurred while creating your account"}
              {error === "EmailCreateAccount" && "Error occurred while creating your account"}
              {error === "Callback" && "Error occurred during authentication callback"}
              {error === "OAuthAccountNotLinked" && "Account is already linked with a different provider"}
              {error === "EmailSignin" && "Error occurred during email sign-in"}
              {error === "CredentialsSignin" && "Invalid credentials provided"}
              {error === "SessionRequired" && "You must be signed in to access this page"}
              {!["OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin", "SessionRequired"].includes(error) && "An unexpected error occurred"}
            </p>
          )}
          
          <p className="text-sm text-red-600">
            Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  )
}
