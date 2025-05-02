'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';
import { fetchBackend } from '@/lib/fetchBackend';

async function registerUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;
  const re_password = password;
  const res = await fetchBackend({
    url: '/api/users/',
    method: 'POST',
    body: { email, password, re_password },
  });
  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { registerUser };
