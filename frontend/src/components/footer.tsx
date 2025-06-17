import Link from 'next/link';
import { ThemeButton } from '@/components/ui/theme-button';
import { Logo } from '@/components/ui/logo';
import { TopButton } from '@/components/ui/top-button';
import { FOOTER_LINKS } from '@/lib/links';

function Footer() {
  return (
    <footer
      id="contact"
      className="mx-auto grid max-w-7xl grid-cols-1 gap-10 p-5 md:grid-cols-3 md:gap-0"
    >
      <div className="mx-auto md:mx-0">
        <Logo />
      </div>
      <div className="grid grid-cols-1 gap-5 text-center md:grid-cols-2 md:text-left">
        {FOOTER_LINKS.map((link, i) => (
          <Link
            key={i}
            href={link.link}
            className="text-muted-foreground hover:text-foreground text-md underline decoration-1 underline-offset-2"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-row-reverse items-end justify-between gap-20 md:flex-col">
        <div className="space-x-5">
          <ThemeButton />
          <TopButton />
        </div>
        <p className="text-muted-foreground text-xs text-nowrap">
          © {new Date().getFullYear()} Copyright GHOST
        </p>
      </div>
    </footer>
  );
}

export { Footer };
