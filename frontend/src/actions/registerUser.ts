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

  if (Array.isArray(json) && json.length > 0) {
    errors.push({
      type: 'root',
      message: json.join(' '),
    });
  }

  ['password', 'email'].forEach(field => {
    if (json[field]) {
      errors.push({
        type: field as 'email' | 'password',
        message: json[field].join(' ') || json[field],
      });
    }
  });

  if (errors.length > 0) return errors;
  if (res.statusText == 'Created') redirect('/confirm/email');
}

export { registerUser };
