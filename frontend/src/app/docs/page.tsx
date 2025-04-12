import DocumentationMdx from '@/lib/documentation.mdx';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DocsPage() {
  return (
    <>
      <main className="min-h-screen">
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
      </main>
      <Footer />
    </>
  );
}
