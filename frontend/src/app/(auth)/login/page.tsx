import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout title="Witamy ponownie" social>
      <UserForm buttonText="Zaloguj się" />
      <p className="text-muted-foreground text-sm">
        Nie masz konta?{' '}
        <Link href="/register" className="text-foreground underline">
          Zarejestruj się
        </Link>
      </p>
    </AuthLayout>
  );
}
