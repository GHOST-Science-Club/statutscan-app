import { ReactNode } from 'react';
import Link from 'next/link';
import { MainContainer } from '@/components/ui/main-container';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { INFO_LINKS } from '@/lib/links';

type Props = {
  children: Readonly<ReactNode>;
};

export default function InfoLayout({ children }: Props) {
  return (
    <>
      <MainContainer className="min-h-screen">
        <nav className="p-2 sm:p-5">
          <ul className="flex flex-wrap gap-5">
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
