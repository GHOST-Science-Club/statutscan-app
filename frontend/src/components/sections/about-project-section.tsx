import { SectionLayout } from '@/components/ui/section-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AboutChatItem } from '@/components/about-chat-item';

const cards = [
  {
    title: 'Koszty',
    description:
      'Oferujemy pomoc bez żadnych opłat. Wszystkie pytania dotyczące edukacji w Polsce można zadawać za darmo',
    footer: null,
  },
  {
    title: 'Szybkość i precyzyjność',
    description:
      'Otrzymasz odpowiedzi szybko i z dużą precyzją, dzięki nowoczesnym algorytmom przetwarzania informacji',
  },
  {
    title: 'Otwartość',
    description:
      'Jesteśmy otwarci na Twoje sugestie i ciągle ulepszamy StatutScan, aby jak najlepiej odpowiadał na Twoje potrzeby',
    footer: (
      <Button className="mt-5" variant="secondary">
        <Link href="/#contact">Skontaktuj się</Link>
      </Button>
    ),
  },
  {
    title: 'Rozwiązanie techniczne',
    description:
      'W naszym asystencie wykorzystujemy nowoczesne technologie, zapewniając innowacyjność i najwyższą jakość.',
    footer: (
      <Button className="mt-5" variant="secondary" asChild>
        <Link href="/docs">Zobacz więcej</Link>
      </Button>
    ),
  },
];

function AboutProjectSection() {
  return (
    <SectionLayout id="project" title="O Projekcie">
      <h3>
        StatutScan to zaawansowany chatbot oparty na sztucznej inteligencji,
        który
        <span className="text-gradient">
          {' '}
          pomaga studentom i kandydatom na studia
        </span>{' '}
        znaleźć odpowiedzi na pytania związane z edukacją w Polsce
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <AboutChatItem key={index} index={index} {...card} />
        ))}
      </div>
    </SectionLayout>
  );
}
export { AboutProjectSection };
