'use client';

import { useState, useEffect } from 'react';

export default function EnvCheckPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/env-check');
        const data = await response.json();
        setEnvData(data);
      } catch (error) {
        console.error('Error checking environment:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEnv();
  }, []);

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const keepLoggedIn = localStorage.getItem('keepLoggedIn');
    
    return { token: !!token, user: !!user, keepLoggedIn: !!keepLoggedIn };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment & Authentication Check</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
            <div className="space-y-3">
              {envData && Object.entries(envData).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    value && value !== 'Not set' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value || 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Storage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Local Storage (OTP Auth)</h2>
            <div className="space-y-3">
              {Object.entries(checkLocalStorage()).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value ? 'Present' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Setup Instructions</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root</p>
            <p>2. Add the following variables:</p>
            <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
{`# Email Configuration for Nodemailer
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OTP Authentication Only
# No external OAuth providers needed

# MongoDB (existing)
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000`}
            </pre>
            <p>3. Restart your development server after adding the environment variables</p>
          </div>
        </div>

        {/* Test OTP Auth */}
        <div className="mt-6 text-center">
          <a 
            href="/signin-otp" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Test OTP Authentication
          </a>
        </div>
      </div>
    </div>
  );
}
