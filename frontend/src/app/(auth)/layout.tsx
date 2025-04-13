import { ReactNode } from 'react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Link href="/" className="absolute top-5 left-5">
        <Logo withText />
      </Link>
      <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-5 p-5">
        {children}
      </main>
    </>
  );
}
