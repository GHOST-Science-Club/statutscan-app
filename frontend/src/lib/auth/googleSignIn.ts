'use server';

import { redirect } from 'next/navigation';
import { fetchBackend } from '@/lib/fetchBackend';

const handleGoogleSignIn = async () => {
  const res = await fetchBackend({
    url: `/api/o/google-oauth2/?redirect_uri=${process.env.GOOGLE_REDIRECT_URL}`,
  });
  const json = await res.json();
  if (json.authorization_url) redirect(json.authorization_url);
};

export { handleGoogleSignIn };
