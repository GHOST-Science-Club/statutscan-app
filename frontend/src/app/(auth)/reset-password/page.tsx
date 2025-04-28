import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetForm } from '@/components/auth/reset-form';

export default function ConfirmPage() {
  return (
    <AuthLayout
      title="Resetuj hasło"
      description={
        <Link href="/login" className="link-underline">
          Wróć do logowania
        </Link>
      }
    >
      <ResetForm />
    </AuthLayout>
  );
}
