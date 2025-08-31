import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/lib/models/OTP';
import User from '@/lib/models/User';
import { signJwtAccessToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name, isSignup = false } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and verify OTP
    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() } // Check if OTP hasn't expired
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    if (isSignup) {
      // Create new user
      const newUser = await User.create({
        name: name || 'User',
        email,
        emailVerified: new Date(),
      });

      // Delete used OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      // Generate JWT token
      const token = signJwtAccessToken({
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
      });

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
    } else {
      // Find existing user for signin
      const existingUser = await User.findOne({ email });
      
      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Delete used OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      // Generate JWT token
      const token = signJwtAccessToken({
        id: existingUser._id.toString(),
        email: existingUser.email,
        name: existingUser.name,
      });

      return NextResponse.json({
        message: 'Sign in successful',
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        },
        token,
      });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
