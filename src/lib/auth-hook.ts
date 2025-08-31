import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  authMethod: 'otp';
}

export function useAuth() {
  const [otpUser, setOtpUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for OTP JWT token in localStorage
    const checkOTPAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('Checking OTP auth:', { token: !!token, userData: !!userData });
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            setOtpUser({
              id: user.id || '',
              name: user.name || '',
              email: user.email || '',
              authMethod: 'otp'
            });
            return;
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        setOtpUser(null);
      } catch (error) {
        console.error('Error checking OTP auth:', error);
        setOtpUser(null);
      }
    };

    checkOTPAuth();
    setIsLoading(false);
  }, []);

  // If OTP user exists, use that
  if (otpUser) {
    return {
      user: otpUser,
      isAuthenticated: true,
      isLoading: false,
      authMethod: 'otp'
    };
  }

  // No authentication
  return {
    user: null,
    isAuthenticated: false,
    isLoading: isLoading,
    authMethod: null
  };
}

export function signOutOTP() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('keepLoggedIn');
  window.location.href = '/signin-otp';
}
