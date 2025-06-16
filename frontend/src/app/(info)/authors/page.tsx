import Image from 'next/image';
import { aboutMetadata } from '@/lib/metadata';
export const metadata = aboutMetadata;

import DaryaImg from '@/../public/info/authors/Darya_Murzich.png';
import IlyaImg from '@/../public/info/authors/ilya_yanukovich.png';
import JedrzejImg from '@/../public/info/authors/jedrzej_ogrodowski.jpg';
import MaksImg from '@/../public/info/authors/maksymilian_norkiewicz.jpg';

const persons = [
  {
    name: 'Maksymilian Norkiewicz',
    position: 'AI Enginner, Project Leader',
    description:
      'Główne zadania: Obracowanie agenta, bazy wektorowej, segmentacja i embedding danych oraz postawienie aplikacji na Azure.',
    image: MaksImg,
  },
  {
    name: 'Jedrzej Ogrodowski',
    position: 'Data Scientist',
    description:
      'Główne zadania: Scraping danych z różnych formatów i źródeł oraz ocena jakości danych.',
    image: JedrzejImg,
  },
  {
    name: 'Ilya Yanukovich',
    position: 'Backend Developer',
    description:
      'Główne zadania: Skonfigurowanie aplikacji w Django, opracowanie mechanizmu logowania oraz weryfikacji tożsamości, pezygotowanie aplikacji pod deploy na Azure.',
    image: IlyaImg,
  },
  {
    name: 'Beniamin Szawracki',
    position: 'Frontend Developer',
    description:
      'Główne zadania: Implementacja front-endu aplikacji w Next.js, integracja z backendem przez logowanie i AI czat.',
    image: null,
  },
  {
    name: 'Darya Murzich',
    position: 'UI/UX Designer',
    description:
      'Główne zadania: Zaprojektowanie spójnego stylu wizualnego dla strony internetowej.',
    image: DaryaImg,
  },
];

export default function AuthorsPage() {
  return (
    <>
      <h1 className="my-2">O autorach</h1>
      <div className="my-5 space-y-10">
        {persons.map((person, index) => (
          <div
            key={index}
            className="mb-8 flex flex-col items-center sm:flex-row"
          >
            {person.image && (
              <Image
                src={person.image}
                alt={`Zdjęcie ${person.name}`}
                width={256}
                height={256}
                className="aspect-square size-24 rounded-full object-cover object-top md:size-[256px]"
                placeholder="blur"
              />
            )}

            <div className="ml-4 flex min-h-full flex-grow flex-col">
              <h2 className="text-lg font-semibold">{person.name}</h2>
              <p>{person.position}</p>
              <p>{person.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
