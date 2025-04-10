import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionLayout } from '@/components/ui/section-layout';

function HomeSection() {
  return (
    <SectionLayout className="home-gradient relative flex min-h-[calc(100svh-40px)] flex-col rounded-xl p-5">
      <h1 className="mb-2">
        PUTagent<span className="text-primary"> ⎯⎯⎯⎯</span>
        <br /> wsparcie <span className="text-gradient">studenckie</span>
      </h1>
      <p className="text-muted-foreground">
        Projekt PUTagent został stworzony z inicjatywy organizacji studenckiej
        GHOST przy Politechnice Poznańskiej
      </p>
      <div className="flex-1" />
      <Button variant="primary" size="lg" className="w-fit" asChild>
        <Link href="/chat">Zadaj pytanie</Link>
      </Button>
    </SectionLayout>
  );
}
export { HomeSection };
