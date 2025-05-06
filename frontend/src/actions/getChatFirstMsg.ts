'use server';

import { fetchBackend } from '@/lib/fetchBackend';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getChatFirstMsg({ question }: { question: string }) {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  const res = await fetchBackend({
    url: '/chat/redirect/',
    method: 'POST',
    body: { question },
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  const json = await res.json();
  if (json.redirect_url) {
    redirect(json.redirect_url);
  }
}

export { getChatFirstMsg };
