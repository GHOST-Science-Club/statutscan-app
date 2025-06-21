import Image from 'next/image';
import { SectionLayout } from '@/components/ui/section-layout';
import { TextAnimate } from '@/components/ui/text-animate';
import person1 from '@/../public/info/authors/maksymilian_norkiewicz.jpg';
import person2 from '@/../public/info/authors/jedrzej_ogrodowski.jpg';
import person3 from '@/../public/info/authors/ilya_yanukovich.png';
import person4 from '@/../public/info/authors/beniamin_sz.jpg';
import person5 from '@/../public/info/authors/Darya_Murzich.png';
import { cn } from '@/lib/utils';

function GhostSection() {
  const persons = [person1, person2, person3, person4, person5];

  return (
    <SectionLayout id="ghost" title="GHOST">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="grid h-fit grid-cols-3 gap-5 pt-5">
          {persons.map((person, i) => (
            <Image
              src={person}
              alt="person"
              key={i}
              placeholder="blur"
              className={cn(
                'aspect-square object-cover object-top',
                i % 3 == 0 && '-mt-5',
                i % 3 == 1 && 'mt-5',
                i % 3 == 2 && 'mt-10',
              )}
            />
          ))}
        </div>
        <div className="col-span-2">
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="text-muted font-heading text-center text-7xl font-extrabold xl:text-[200px]"
          >
            GHOST
          </TextAnimate>
          <h3>Organizacja studencka przy Politechnice Poznaskiej</h3>
          <br />
          <p>
            Jesteśmy członkami społeczności koła naukowego GHOST. Działania,
            które podejmujemy w kole są dla nas nie tylko możliwością do nauki,
            ale również do wywierania wpływu na otoczenie. Projekt StatutScan
            jest tego przykładem. Naszym celem jest wywrzeć wpływ na Polski
            system edukacji i pomóc uczniom z ich problemami z administracją.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

export { GhostSection };
