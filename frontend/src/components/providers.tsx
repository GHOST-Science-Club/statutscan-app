'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

type Props = {
  children: ReactNode;
};

function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export { Providers };
