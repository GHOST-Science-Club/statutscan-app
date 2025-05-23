import './globals.css';
import { ReactNode } from 'react';
import { Montserrat, Open_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import { layoutMetadata } from '@/lib/metadata';

export const metadata = layoutMetadata;

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

type Props = {
  children: Readonly<ReactNode>;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
