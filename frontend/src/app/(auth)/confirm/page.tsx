import Link from 'next/link';
import { EmailConfirm } from '@/components/auth/email-confirm';

export default function ConfirmPage() {
  return (
    <>
      <h1 className="mb-10 text-3xl text-nowrap sm:text-5xl">Utwórz konto</h1>
      <EmailConfirm />
      <Link href="/login" className="text-muted-foreground text-sm underline">
        Wyślij kod weryfikacyjny ponownie
      </Link>
    </>
  );
}
