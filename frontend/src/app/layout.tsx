import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { montserrat, openSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Statutscan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
