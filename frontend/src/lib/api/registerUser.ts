'use server';

import { z } from 'zod';
import { userSchema } from '@/lib/types';

async function registerUser(values: z.infer<typeof userSchema>) {
  const { email, password } = values;

  // TODO repassowr, username will be deleted
  const username = 'benten';
  const re_password = password;

  const res = await fetch(process.env.API_URL + '/api/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, email, password, re_password }),
  });

  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { registerUser };
