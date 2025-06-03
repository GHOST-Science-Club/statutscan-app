import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { activateUser } from '@/lib/auth/activateUser';
import { notFound } from 'next/navigation';
import { activationMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ uid: string; token: string }>;
};

export const metadata = activationMetadata;

export default async function ActivationPage({ params }: Props) {
  const { uid, token } = await params;
  const ok = await activateUser({ uid, token });
  if (!ok) notFound();
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
