import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);
    
    return NextResponse.json({
      success: true,
      authenticated: !!auth,
      user: auth ? {
        name: auth.user?.name,
        email: auth.user?.email,
        id: auth.user?.id,
      } : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test authentication',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
