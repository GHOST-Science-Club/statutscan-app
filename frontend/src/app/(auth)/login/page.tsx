import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';

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
      <UserForm rememberPassword buttonText="Zaloguj się" />
    </AuthLayout>
  );
}
