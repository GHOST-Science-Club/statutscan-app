'use server';

import { fetchBackend } from '@/lib/fetchBackend';

type Values = {
  uid: string;
  token: string;
};

async function activateUser(values: Values) {
  const { uid, token } = values;
  const res = await fetchBackend({
    url: '/api/users/activation/',
    method: 'POST',
    body: { uid, token },
  });
  return res.ok;
}

export { activateUser };
