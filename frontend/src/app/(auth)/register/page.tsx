import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';

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
      <UserForm buttonText="Dalej" />
    </AuthLayout>
  );
}
