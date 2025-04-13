import { ReactNode } from 'react';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute top-5 left-5">
        <Logo withText />
      </div>
      <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-5 p-5">
        {children}
      </main>
    </>
  );
}
