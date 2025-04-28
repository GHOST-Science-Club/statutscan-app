'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';

async function loginUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;

  const res = await fetch(process.env.API_URL + '/api/jwt/create/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { loginUser };
