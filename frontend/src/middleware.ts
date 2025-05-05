import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/actions/verifyToken';
import { refreshToken } from '@/actions/refreshToken';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  if (request.nextUrl.pathname.startsWith('/chat')) {
    const firstAttempt = await verifyToken();
    if (!firstAttempt) {
      await refreshToken();
      const secondAttempt = await verifyToken();
      if (!secondAttempt)
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:path'],
};
