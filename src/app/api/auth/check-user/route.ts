import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });
    
    return NextResponse.json({
      success: true,
      exists: !!user,
      user: user ? {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      } : null,
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check user' },
      { status: 500 }
    );
  }
}
