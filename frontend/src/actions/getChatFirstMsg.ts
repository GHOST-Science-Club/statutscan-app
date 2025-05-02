'use server';

import { fetchBackend } from '@/lib/fetchBackend';

async function getChatFirstMsg({ question }: { question: string }) {
  const res = await fetchBackend({
    url: '/chat/redirect/',
    method: 'POST',
    body: { question },
  });

  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { getChatFirstMsg };
