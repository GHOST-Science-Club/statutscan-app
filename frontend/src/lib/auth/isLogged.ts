'use server';
import { verifyToken } from '@/lib/auth/verifyToken';
import { refreshToken } from '@/lib/auth/refreshToken';

async function isLogged() {
  const firstAttempt = await verifyToken();
  if (!firstAttempt) {
    await refreshToken();
    return await verifyToken();
  }
  return firstAttempt;
}
export { isLogged };
