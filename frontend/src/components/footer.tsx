import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { ThemeButton } from '@/components/theme-button';
import { Logo } from '@/components/ui/logo';

function Footer() {
  return (
    <footer
      id="kontakt"
      className="grid grid-cols-1 gap-10 p-5 md:grid-cols-4 md:gap-0"
    >
      <div className="mx-auto md:mx-0">
        <Logo className="h-auto w-5" withText />
      </div>
      <div className="flex justify-around md:flex-col md:justify-between">
        <div>
          <span className="text-muted-foreground text-sm">LOREM IPSUM</span>
          <p className="text-lg">Lorem ipsum</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">LOREM IPSUM</span>
          <p className="text-lg">Lorem ipsum</p>
        </div>
      </div>
      <div className="flex justify-around md:flex-col md:justify-between">
        <div>
          <span className="text-muted-foreground text-sm">LOREM IPSUM</span>
          <p className="text-lg">Lorem ipsum</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">LOREM IPSUM</span>
          <p className="text-lg">Lorem ipsum</p>
        </div>
      </div>
      <div className="flex flex-row-reverse items-end justify-between gap-20 md:flex-col">
        <div className="space-x-5">
          <ThemeButton />
          <Button variant="primary" size="icon" className="rounded-full">
            <ArrowUp />
          </Button>
        </div>
        <p className="text-muted-foreground text-xs text-nowrap">
          © {new Date().getFullYear()} Copyright
        </p>
      </div>
    </footer>
  );
}

export { Footer };
