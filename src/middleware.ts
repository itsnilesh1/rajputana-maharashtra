import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes — require admin or moderator
    if (path.startsWith('/admin')) {
      if (!token || !['admin', 'moderator'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
      }
    }

    // API admin routes — require admin or moderator
    if (path.startsWith('/api/admin')) {
      if (!token || !['admin', 'moderator'].includes(token.role as string)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const response = NextResponse.next();

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return response;
  },
  {
    callbacks: {
      // Let Next.js handle the redirect — only block truly protected pages
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // For admin routes, require token
        if (path.startsWith('/admin')) return !!token;
        // For dashboard, allow through — dashboard layout handles redirect server-side
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
