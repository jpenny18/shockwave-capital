import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/admin-auth/:path*'],
  runtime: 'experimental-edge',
};

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Only run on admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for admin-auth page to prevent redirect loop
    if (request.nextUrl.pathname === '/admin-auth') {
      return NextResponse.next();
    }

    const session = request.cookies.get('session');

    if (!session) {
      // Redirect to admin login if no session exists
      return NextResponse.redirect(new URL('/admin-auth', request.url));
    }

    try {
      // Make a request to your API endpoint to verify the session
      const verifyResponse = await fetch(new URL('/api/auth/verify-session', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session: session.value }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Session verification failed');
      }

      const { isAdmin } = await verifyResponse.json();
      
      if (!isAdmin) {
        // If not admin, redirect to admin login
        return NextResponse.redirect(new URL('/admin-auth', request.url));
      }

      // Allow access to admin routes for admin users
      return NextResponse.next();
    } catch (error) {
      console.error('Session verification failed:', error);
      // If session is invalid, redirect to admin login
      return NextResponse.redirect(new URL('/admin-auth', request.url));
    }
  }

  return NextResponse.next();
} 