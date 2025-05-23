'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { cookies } from 'next/headers';

async function getChat(id: string) {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  const res = await fetchBackend({
    url: `/chat/${id}/`,
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!res.ok) return null;
  const json: {
    title: string;
    chat_history: {
      role: 'user' | 'assistant';
      content: string;
      sources?: { title?: string; source: string }[];
    }[];
  } = await res.json();
  return json;
}

export { getChat };
