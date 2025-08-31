import type React from "react"
import Link from "next/link"
import { UserFlowHandler } from "@/components/UserFlowHandler"

export default function SignUpPage() {
  return (
    <UserFlowHandler mode="signup">
      <main className="min-h-screen bg-white relative">
      <div className="hidden md:flex items-center gap-2 absolute top-6 left-8 z-10">
        <img src="/hdlogo.png" alt="HD Logo" className="h-6 w-6" />
        <span className="text-lg font-semibold tracking-tight" style={{color:"black"}}>HD</span>
      </div>

      <header className="md:hidden">
        <div className="mx-auto flex items-center justify-center gap-2 px-6 pt-29 pb-2">
          <img src="/hdlogo.png" alt="HD Logo" className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight text-black">HD</span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-0 py-0 md:grid-cols-[3fr_2fr] md:py-0 min-h-screen md:min-h-screen">
        
         <div className="flex items-start justify-center md:items-start md:justify-end py-4 px-6 md:py-10 md:px-8 md:pr-6 lg:py-12 lg:px-12 lg:pr-8 xl:py-16 xl:px-8 xl:pr-16">
                     <div className="w-full max-w-md lg:max-w-lg xl:scale-110 py-10 ">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-balance text-black">Sign up</h1>
            <p className="mb-6 text-sm text-black">Sign up to enjoy the feature of HD</p>

            <form className="space-y-4" aria-label="Sign up">
              <Link
                href="/signup-otp"
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Sign up with OTP
              </Link>
            </form>

            <p className="mt-3 text-center text-xs text-black">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:block order-first md:order-none h-screen pl-4 pr-1 py-2">
          <div className="h-full w-full overflow-hidden rounded-2xl">
            <img
              src="image.png"
              alt="Abstract blue folds artwork"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      </main>
    </UserFlowHandler>
  )
}




