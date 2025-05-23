import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionLayout } from '@/components/ui/section-layout';
import hatPng from '@/../public/hat.png';
import Image from 'next/image';
import { TextAnimate } from '@/components/ui/text-animate';

function HomeSection() {
  return (
    <SectionLayout
      id="home"
      className="home-gradient relative flex h-[calc(100svh-90px)] max-h-[800px] min-h-[530px] flex-col rounded-xl p-5"
    >
      <h1 className="mb-2">
        PUTagent<span className="text-primary"> ⎯⎯⎯⎯</span>
        <br /> wsparcie <span className="text-gradient">studenckie</span>
      </h1>
      <TextAnimate duration={0.5} className="text-muted-foreground">
        Projekt PUTagent został stworzony z inicjatywy organizacji studenckiej
        GHOST przy Politechnice Poznańskiej
      </TextAnimate>
      <div className="relative flex-1">
        <Image
          src={hatPng}
          alt="Zdjęcie czapki studenckiej"
          fill
          className="object-contain object-right"
        />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="mx-auto w-fit md:mx-0"
        asChild
      >
        <Link href="/chat">Zadaj pytanie</Link>
      </Button>
    </SectionLayout>
  );
}
export { HomeSection };
