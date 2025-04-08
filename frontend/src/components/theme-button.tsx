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
      <Button variant="outline" size="icon">
        <Loader className="animate-spin" />
        <span className="sr-only">Loading</span>
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTheme(otherTheme)}
    >
      {otherTheme == 'light' ? <Moon /> : <Sun />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
export { ThemeButton };
