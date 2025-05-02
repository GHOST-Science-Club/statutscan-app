'use server';
import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';
import { refreshToken } from '@/actions/refreshToken';

async function verifyToken() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access')?.value;

  if (!accessToken) {
    await refreshToken();
    accessToken = cookieStore.get('access')?.value;
  }

  const res = await fetchBackend({
    url: '/api/jwt/verify/',
    method: 'POST',
    headers: {
      Cookie: `access=${accessToken}`,
    },
  });

  return res.status === 200;
}

export { verifyToken };
