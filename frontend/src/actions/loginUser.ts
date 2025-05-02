'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';
import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';

async function loginUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;
  const res = await fetchBackend({
    url: '/api/jwt/create/',
    method: 'POST',
    body: { email, password },
  });
  const json = await res.json();
  console.log(json, res.status);
  const cookieStore = await cookies();
  cookieStore.set('access', json.access, {
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' && 'strict',
    path: '/',
    maxAge: 86400,
  });
  cookieStore.set('refresh', json.refresh, {
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' && 'strict',
    path: '/',
    maxAge: 86400,
  });
}

export { loginUser };
