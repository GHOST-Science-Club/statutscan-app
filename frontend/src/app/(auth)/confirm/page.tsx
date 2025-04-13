import Link from 'next/link';
import { EmailConfirm } from '@/components/auth/email-confirm';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function ConfirmPage() {
  return (
    <AuthLayout title="Utwórz konto">
      <EmailConfirm />
      <Link href="/login" className="text-muted-foreground text-sm underline">
        Wyślij kod weryfikacyjny ponownie
      </Link>
    </AuthLayout>
  );
}
