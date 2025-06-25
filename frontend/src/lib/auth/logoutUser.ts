'use server';

import { cookies } from 'next/headers';
import { fetchBackend } from '@/lib/fetchBackend';
import { redirect } from 'next/navigation';

async function logoutUser() {
  await fetchBackend({
    url: '/api/logout/',
    method: 'POST',
  });
  const cookieStore = await cookies();
  cookieStore.delete('access');
  cookieStore.delete('refresh');

  redirect('/');
}

export { logoutUser };
