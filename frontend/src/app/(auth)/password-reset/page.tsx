import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetPassForm } from '@/components/auth/reset-pass-form';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Resetuj hasło"
      description={
        <Link href="/login" className="link-underline">
          Wróć do logowania
        </Link>
      }
    >
      <ResetPassForm />
    </AuthLayout>
  );
}
