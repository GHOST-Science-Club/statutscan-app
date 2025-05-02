'use server';

import { z } from 'zod';
import { loginSchema } from '@/lib/types';
import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';
import { redirect } from 'next/navigation';

async function loginUser(values: z.infer<typeof loginSchema>) {
  const { email, password } = values;
  const res = await fetchBackend({
    url: '/api/jwt/create/',
    method: 'POST',
    body: { email, password },
  });
  const json = await res.json();
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

  if (res.status == 200) {
    redirect('/chat');
  }
}

export { loginUser };
