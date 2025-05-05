import Image from 'next/image';
import { SectionLayout } from '@/components/ui/section-layout';
import { TextAnimate } from '@/components/ui/text-animate';
import person1 from '@/../public/person1.png';
import person2 from '@/../public/person2.png';
import person3 from '@/../public/person3.png';
import person4 from '@/../public/person4.png';
import person5 from '@/../public/person5.png';
import person6 from '@/../public/person6.png';
import person7 from '@/../public/person7.png';
import person8 from '@/../public/person8.png';
import person9 from '@/../public/person9.png';
import { cn } from '@/lib/utils';

function GhostSection() {
  const persons = [
    person1,
    person2,
    person3,
    person4,
    person5,
    person6,
    person7,
    person8,
    person9,
  ];

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
            Lorem ipsum dolor sit amet consectetur. Mi sagittis pretium varius
            est nisi euismod dignissim. Ultrices turpis nec pellentesque dui
            tellus egestas sed pellentesque tortor. Tellus dolor eleifend
            volutpat purus sit netus auctor. Bibendum cras malesuada suspendisse
            pellentesque a ullamcorper.
            <br />
            <br />
            At fermentum libero elementum id. Posuere eget nec interdum mauris
            pellentesque adipiscing neque. Enim ut porta velit amet id ante. Sed
            tempor porttitor urna sociis et enim nulla. Placerat ac senectus
            vivamus in laoreet posuere interdum.
            <br />
            <br /> Maecenas quis ut sit interdum etiam nec urna mollis ipsum.
            Vitae pellentesque diam diam ut nibh et. Purus nullam posuere
            sodales elit pellentesque. Pellentesque viverra neque viverra
            commodo lacus aliquam.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

export { GhostSection };
