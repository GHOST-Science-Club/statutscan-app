'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

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
      <ProgressProvider
        height="4px"
        color="#f2c215"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
}

export { Providers };
