import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { SocialButtons } from '@/components/auth/social-buttons';

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-10 text-3xl text-nowrap sm:text-5xl">Utwórz konto</h1>
      <UserForm buttonText="Dalej" />
      <p className="text-muted-foreground text-sm">
        Masz już konto?{' '}
        <Link href="/login" className="text-foreground underline">
          Zaloguj się
        </Link>
      </p>
      <SocialButtons />
    </>
  );
}
