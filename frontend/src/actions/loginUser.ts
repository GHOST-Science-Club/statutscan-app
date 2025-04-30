'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';
import { cookies } from 'next/headers';

async function loginUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;

  const res = await fetch(process.env.API_URL + '/api/jwt/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(res);
  const json = await res.json();

  const cookieStore = await cookies();
  cookieStore.set('access', json.access, {
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' && 'strict',
    path: '/',
  });
  cookieStore.set('refresh', json.refresh, {
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV == 'production' && 'strict',
    path: '/',
  });
}

export { loginUser };
