import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/actions/verifyToken';
import { refreshToken } from '@/actions/refreshToken';

export async function middleware(request: NextRequest) {
  const firstAttempt = await verifyToken();
  if (!firstAttempt) {
    await refreshToken();
    const secondAttempt = await verifyToken();
    if (!secondAttempt)
      return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat', '/chat/:path'],
};
