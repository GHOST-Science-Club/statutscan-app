'use server';
import { verifyToken } from '@/actions/verifyToken';
import { refreshToken } from '@/actions/refreshToken';

async function isLogged() {
  const firstAttempt = await verifyToken();
  if (!firstAttempt) {
    await refreshToken();
    return await verifyToken();
  }
  return firstAttempt;
}
export { isLogged };
