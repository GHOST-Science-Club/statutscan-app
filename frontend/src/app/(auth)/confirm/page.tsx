import Link from 'next/link';
import { ConfirmForm } from '@/components/auth/confirm-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function ConfirmPage() {
  return (
    <AuthLayout
      title="Utwórz konto"
      description={
        <Link href="/login" className="underline">
          Wyślij kod weryfikacyjny ponownie
        </Link>
      }
    >
      <ConfirmForm />
    </AuthLayout>
  );
}
