'use server';

import { z } from 'zod';
import { registerSchema } from '@/lib/types';
import { fetchBackend } from '@/lib/fetchBackend';
import { redirect } from 'next/navigation';

async function registerUser(values: z.infer<typeof registerSchema>) {
  const { email, password, re_password } = values;
  const username = 'asdasd123asd';
  const res = await fetchBackend({
    url: '/api/users/',
    method: 'POST',
    body: { username, email, password, re_password },
  });
  console.log(await res.json());
  if (res.statusText == 'Created') redirect('/confirm/email');
}

export { registerUser };
