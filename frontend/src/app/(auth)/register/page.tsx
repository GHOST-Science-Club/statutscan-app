import Link from 'next/link';
import { UserForm } from '@/components/auth/user-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { registerUser } from '@/actions/registerUser';

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
      <UserForm onSubmit={registerUser} buttonText="Dalej" />
    </AuthLayout>
  );
}
