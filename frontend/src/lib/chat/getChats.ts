'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { cookies } from 'next/headers';

async function getChats() {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  const res = await fetchBackend({
    url: '/chats/',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  const json = await res.json();
  return json.chats;
}

export { getChats };
