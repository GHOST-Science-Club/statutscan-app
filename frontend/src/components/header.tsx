import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const links = [
  {
    name: 'O CZACIE',
  },
  {
    name: 'GHOST',
  },
  {
    name: 'FAQ',
  },
  {
    name: 'KONTAKT',
  },
];

function Header() {
  return (
    <header className="bg-background fixed top-0 left-0 z-10 w-full px-5 py-2 shadow-sm">
      <nav className="flex items-center justify-between">
        <Link href="/">
          <Logo className="h-10 w-auto" withText />
        </Link>
        <ul className="bg-muted flex items-center gap-10 rounded-full px-5 py-2">
          {links.map((link, i) => (
            <li key={i}>
              <Link href={`/#${link.name}`}>{link.name}</Link>
            </li>
          ))}
        </ul>

        <Button variant="secondary" asChild>
          <Link href="/login">Zaloguj się</Link>
        </Button>
      </nav>
    </header>
  );
}
export { Header };
