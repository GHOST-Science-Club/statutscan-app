import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainContainer } from '@/components/ui/main-container';
import { Footer } from '@/components/footer';
import DocumentationMdx from '@/lib/documentation.mdx';
import { docsMetadata } from '@/lib/metadata';

export const metadata = docsMetadata;

export default function DocsPage() {
  return (
    <>
      <MainContainer className="min-h-screen">
        <nav className="p-2 sm:p-5">
          <ul className="flex gap-5">
            <li>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft />
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/chat">Czat</Link>
              </Button>
            </li>
            <li>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/login">Zaloguj się</Link>
              </Button>
            </li>
          </ul>
        </nav>
        <DocumentationMdx />
      </MainContainer>
      <Footer />
    </>
  );
}
