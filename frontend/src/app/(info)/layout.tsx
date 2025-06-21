import { ReactNode } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { MainContainer } from '@/components/ui/main-container';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { INFO_LINKS } from '@/lib/links';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  children: Readonly<ReactNode>;
};

export default function InfoLayout({ children }: Props) {
  return (
    <>
      <MainContainer className="min-h-screen">
        <nav className="mb-5 p-2 sm:p-5">
          <div className="flex justify-between sm:hidden">
            <Link href="/" aria-label="Strona główna">
              <Logo />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="sm:hidden" asChild>
                <Button variant="secondary" size="icon" aria-label="Menu">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {INFO_LINKS.map((link, i) => (
                  <DropdownMenuItem key={i} asChild>
                    <Link href={link.link}>{link.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ul className="hidden flex-wrap items-center gap-5 sm:flex">
            <li>
              <Link href="/" aria-label="Strona główna">
                <Logo />
              </Link>
            </li>
            <li className="sm:hidden"></li>
            {INFO_LINKS.map((link, i) => (
              <li key={i}>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={link.link}>{link.name}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </MainContainer>
      <Footer />
    </>
  );
}
