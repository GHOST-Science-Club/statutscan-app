import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import hatImg from '@/../public/hat.png';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="mt-5">
        <Logo className="size-12" withText />
      </div>
      <div className="h-[300px] md:h-[400px]" />
      <div className="mb-5 flex flex-col items-center gap-5 text-center">
        <p className="text-2xl font-semibold">Strona nie została znaleziona</p>
        <Button className="!bg-background" variant="outline">
          <Link href="/">Powrót na strone główną</Link>
        </Button>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-30 pr-[20px] pb-[100px] md:pr-[38px] md:pb-[228px]">
        <Image src={hatImg} alt="" className="h-fit w-20 md:w-50" />
      </div>

      <h1 className="from-primary to-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-50% to-50% bg-clip-text text-9xl text-transparent md:text-[300px]">
        404
      </h1>
      <div className="bg-primary absolute bottom-0 left-0 -z-10 h-1/2 w-full" />
    </main>
  );
}
