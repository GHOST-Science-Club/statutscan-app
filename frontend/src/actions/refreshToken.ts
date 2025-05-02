'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';

async function refreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh')?.value;

  const res = await fetchBackend({
    url: '/api/jwt/refresh/',
    method: 'POST',
    headers: {
      Cookie: `refresh=${refreshToken}`,
    },
  });

  const json = await res.json();
  if (json.access)
    cookieStore.set('access', json.access, {
      secure: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV == 'production' && 'strict',
      path: '/',
      maxAge: 86400,
    });
}

export { refreshToken };
