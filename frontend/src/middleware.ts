import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isLogged } from '@/lib/auth/isLogged';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  if (request.nextUrl.pathname.startsWith('/chat')) {
    const logged = await isLogged();
    if (!logged) return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
