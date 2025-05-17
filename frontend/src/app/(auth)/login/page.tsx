import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

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
      <LoginForm />
    </AuthLayout>
  );
}
