import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Admin Authentication Middleware
 * Protects admin routes from unauthorized access
 */
export async function requireAdmin() {
  try {
    // Get the session using NextAuth v5 auth() function
    const session = await auth();

    // Check if user is logged in
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please sign in.'
        },
        { status: 401 }
      );
    }

    // Check if user is an admin
    // @ts-ignore - user.role exists in our extended session
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden. Admin access required.'
        },
        { status: 403 }
      );
    }

    // User is authenticated and is admin
    return null; // null means authorized, continue
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication error.'
      },
      { status: 500 }
    );
  }
}

/**
 * Helper to wrap admin API routes with authentication
 */
export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Check authentication
    const authError = await requireAdmin();
    if (authError) {
      return authError;
    }

    // If authorized, proceed with the handler
    return handler(req);
  };
}
