'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';

async function registerUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;
  const re_password = password;

  const res = await fetch(process.env.API_URL + '/api/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, re_password }),
  });

  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { registerUser };
