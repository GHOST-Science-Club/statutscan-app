'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { cookies } from 'next/headers';

async function getChatFirstMsg({ question }: { question: string }) {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;
  console.log(question);
  const res = await fetchBackend({
    url: '/chat/redirect/',
    method: 'POST',
    body: { question },
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { getChatFirstMsg };
