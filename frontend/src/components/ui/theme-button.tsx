'use client';
import { Moon, Sun, Loader } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';

function ThemeButton() {
  const { setTheme, theme } = useTheme();
  const otherTheme = theme == 'light' ? 'dark' : 'light';
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <Button
        aria-label="Ładowanie przycisku"
        variant="outline"
        size="icon"
        className="rounded-full"
      >
        <Loader className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTheme(otherTheme)}
      className="rounded-full"
      aria-label="Zmień motyw"
    >
      {otherTheme == 'light' ? <Moon /> : <Sun />}
    </Button>
  );
}
export { ThemeButton };
