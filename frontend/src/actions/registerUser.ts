'use server';

import { z } from 'zod';
import { registerSchema } from '@/lib/types';
import { fetchBackend } from '@/lib/fetchBackend';
import { redirect } from 'next/navigation';

async function registerUser(values: z.infer<typeof registerSchema>) {
  const { email, password, re_password } = values;
  const res = await fetchBackend({
    url: '/api/users/',
    method: 'POST',
    body: { email, password, re_password },
  });

  const json = await res.json();
  const errors: { type: 'email' | 'password' | 'root'; message: string }[] = [];

  if (json.email) {
    errors.push({
      type: 'email',
      message: json.email.join(' ') || json.email,
    });
  } else if (json.password) {
    errors.push({
      type: 'password',
      message: json.password.join(' ') || json.password,
    });
  } else
    errors.push({
      type: 'root',
      message: json.join(' '),
    });

  if (errors.length > 0) return errors;
  if (res.statusText == 'Created') redirect('/confirm/email');
}

export { registerUser };
