'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { z } from 'zod';
import { resetConfirmSchema } from '@/lib/types';

type Props = {
  uid: string;
  token: string;
} & z.infer<typeof resetConfirmSchema>;

async function resetConfirmPassword(props: Props) {
  const { uid, token, new_password, re_new_password } = props;
  const res = await fetchBackend({
    url: '/api/users/reset_password_confirm/',
    method: 'POST',
    body: {
      uid,
      token,
      new_password,
      re_new_password,
    },
  });
  console.log(res);
  return res.ok;
}

export { resetConfirmPassword };
