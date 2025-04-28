import Link from 'next/link';
import { UserForm } from '@/components/auth/user-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { loginUser } from '@/lib/api/loginUser';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Witamy ponownie"
      description={
        <>
          Nie masz konta?{' '}
          <Link href="/register" className="link-underline">
            Zarejestruj się
          </Link>
        </>
      }
      social
    >
      <UserForm
        onSubmit={loginUser}
        rememberPassword
        buttonText="Zaloguj się"
      />
    </AuthLayout>
  );
}
