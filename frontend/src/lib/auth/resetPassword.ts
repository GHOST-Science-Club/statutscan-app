'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { z } from 'zod';
import { resetSchema } from '@/lib/types';

async function resetPassword({ email }: z.infer<typeof resetSchema>) {
  const res = await fetchBackend({
    url: '/api/users/reset_password/',
    method: 'POST',
    body: {
      email,
    },
  });
  console.log(res);
  return res.ok;
}

export { resetPassword };
