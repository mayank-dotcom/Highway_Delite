import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/lib/models/OTP';
import User from '@/lib/models/User';
import { sendOTPEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, name, isSignup = false } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists for signin
    if (!isSignup) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found. Please sign up first.' },
          { status: 404 }
        );
      }
    }

    // Check if user already exists for signup
    if (isSignup) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists. Please sign in instead.' },
          { status: 409 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      expiresAt,
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      email,
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
