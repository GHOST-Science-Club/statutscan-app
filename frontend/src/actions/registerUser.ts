'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';
import { fetchBackend } from '@/lib/fetchBackend';
import { redirect } from 'next/navigation';

async function registerUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;
  const username = 'asdasd123asd';
  const re_password = password;
  const res = await fetchBackend({
    url: '/api/users/',
    method: 'POST',
    body: { username, email, password, re_password },
  });
  console.log(await res.json());
  if (res.statusText == 'Created') redirect('/confirm/email');
}

export { registerUser };
