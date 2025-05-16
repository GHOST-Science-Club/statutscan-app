'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { cookies } from 'next/headers';

async function getChat({ id }: { id: string }) {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  const res = await fetchBackend({
    url: `/chat/${id}/`,
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  const json: {
    title: string;
    chat_history: {
      role: 'user' | 'assistant';
      content: string;
      sources?: any;
    }[];
  } = await res.json();
  return json.chat_history;
}

export { getChat };
