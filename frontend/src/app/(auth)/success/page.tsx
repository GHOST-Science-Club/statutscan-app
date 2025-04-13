import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <>
      <h1 className="mb-10 text-3xl text-nowrap sm:text-5xl">Dziękujemy!</h1>
      <p className="text-muted-foreground">
        Twoje konto zostało utworzone. Zapraszamy do korzystania z PUTagent.
      </p>
      <Button asChild>
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </>
  );
}
