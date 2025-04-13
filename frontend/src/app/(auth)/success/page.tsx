import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function SuccessPage() {
  return (
    <AuthLayout title="Dziękujemy!">
      <p className="text-muted-foreground text-center">
        Twoje konto zostało utworzone. Zapraszamy do korzystania z PUTagent.
      </p>
      <Button asChild className="w-full">
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </AuthLayout>
  );
}
