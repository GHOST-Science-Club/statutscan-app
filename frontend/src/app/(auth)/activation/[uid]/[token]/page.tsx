import { activateUser } from '@/lib/api/activateUser';
import { AuthLayout } from '@/components/auth/auth-layout';
import Link from 'next/link';

type Params = {
  uid: string;
  token: string;
};

export default async function ActivationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid, token } = await params;
  await activateUser({ uid, token });
  return (
    <AuthLayout title="Poprawnie aktywowano konto">
      <Link href="/login">Zaloguj się</Link>
    </AuthLayout>
  );
}
