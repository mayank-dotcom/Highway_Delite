import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      // Google OAuth removed - OTP only
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
  });
}
