import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/actions/verifyToken';

export async function middleware(request: NextRequest) {
  const isLogged = await verifyToken();
  if (!isLogged) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat', '/chat/:path'],
};
