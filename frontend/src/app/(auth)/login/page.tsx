import { UserForm } from '@/components/auth/user-form';
import Link from 'next/link';
import { SocialButtons } from '@/components/auth/social-buttons';

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-10 text-3xl text-nowrap sm:text-5xl">
        Witamy ponownie
      </h1>
      <UserForm buttonText="Zaloguj się" />
      <p className="text-muted-foreground text-sm">
        Nie masz konta?{' '}
        <Link href="/register" className="text-foreground underline">
          Zarejestruj się
        </Link>
      </p>
      <SocialButtons />
    </>
  );
}
