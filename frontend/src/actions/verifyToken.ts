'use server';
import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';

async function verifyToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;

  const res = await fetchBackend({
    url: '/api/jwt/verify/',
    method: 'POST',
    headers: {
      Cookie: `access=${accessToken}`,
    },
  });
  console.log(res.status);
  return res.status === 200;
}

export { verifyToken };
