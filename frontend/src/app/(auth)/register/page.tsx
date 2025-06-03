import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { registerMetadata } from '@/lib/metadata';

export const metadata = registerMetadata;

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Utwórz konto"
      social
      description={
        <>
          Masz już konto?{' '}
          <Link href="/login" className="link-underline">
            Zaloguj się
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
