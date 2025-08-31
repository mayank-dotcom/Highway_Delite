'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SigninOTPPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'jonas_kahnwald@gmail.com',
    otp: '',
    keepLoggedIn: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const sendOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          isSignup: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setError('');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          isSignup: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP verification successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (formData.keepLoggedIn) {
          localStorage.setItem('keepLoggedIn', 'true');
        }
        
        console.log('Stored in localStorage:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
        
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <div className="w-full max-w-md lg:max-w-lg xl:scale-110 py-10">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-balance text-black">Sign in</h1>
            <p className="mb-6 text-sm text-black">Please login to continue to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in">
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-black outline-none ring-offset-background transition-colors placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label htmlFor="otp" className="mb-1 block text-xs font-medium text-black">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="OTP"
                    className="h-10 w-full rounded-md border border-input bg-white px-3 pr-12 text-sm text-black outline-none ring-offset-background transition-colors placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading || otpSent}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    {otpSent ? '✓' : '↻'}
                  </button>
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                )}
                {otpSent && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keepLoggedIn" className="ml-2 block text-sm text-black">
                  Keep me logged in
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || !otpSent}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-black">
              Need an account?{" "}
              <Link href="/signup-otp" className="font-medium text-blue-600 hover:underline">
                Create one
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
  );
}
