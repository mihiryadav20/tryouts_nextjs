import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/test-auth - Test endpoint to debug authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    
    // Log full session and request details
    console.log('Session in test-auth:', JSON.stringify(session));
    console.log('Request cookies:', request.headers.get('cookie'));
    
    // Return detailed session info
    return NextResponse.json({
      hasSession: !!session,
      sessionDetails: session,
      cookies: request.headers.get('cookie'),
      userAgent: request.headers.get('user-agent'),
    });
    
  } catch (error) {
    console.error('Error in test-auth:', error);
    return NextResponse.json(
      { error: 'Error testing authentication', details: String(error) },
      { status: 500 }
    );
  }
}
