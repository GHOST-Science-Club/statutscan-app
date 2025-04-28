import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { activateUser } from '@/lib/api/activateUser';

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
  if (!uid || !token) notFound();

  await activateUser({ uid, token });

  return (
    <AuthLayout title="Dziękujemy!">
      <p className="text-muted-foreground text-center">
        Twoje konto zostało utworzone i aktywowane. Zapraszamy do korzystania z
        PUTagent.
      </p>
      <Button asChild className="w-full">
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </AuthLayout>
  );
}
