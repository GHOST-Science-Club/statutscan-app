import { AuthLayout } from '@/components/auth/auth-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnAuthorizedPage() {
  return (
    <AuthLayout
      title="Brak dostępu"
      description="Nie masz uprawnień do tej strony."
    >
      <div className="text-foreground flex items-center gap-5">
        <Button asChild>
          <Link href="/login">Zaloguj się</Link>
        </Button>
        <p>lub</p>
        <Button asChild>
          <Link href="/register">Zarejestruj się</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
