import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function RegisterPage() {
  return (
    <AuthLayout title="Utwórz konto" social>
      <UserForm buttonText="Dalej" />
      <p className="text-muted-foreground text-sm">
        Masz już konto?{' '}
        <Link href="/login" className="text-foreground underline">
          Zaloguj się
        </Link>
      </p>
    </AuthLayout>
  );
}
