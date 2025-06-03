'use server';

import { redirect } from 'next/navigation';
import { fetchBackend } from '@/lib/fetchBackend';

const handleGoogleSignIn = async () => {
  const res = await fetchBackend({
    url: `/api/o/google-oauth2/?redirect_uri=http://localhost:3000/login/google`,
  });
  const json = await res.json();
  if (json.authorization_url) redirect(json.authorization_url);
};

export { handleGoogleSignIn };
