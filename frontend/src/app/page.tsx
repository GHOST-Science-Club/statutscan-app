import { Button } from '@/components/ui/button';
import { ThemeButton } from '@/components/theme-button';

export default function Home() {
  return (
    <div className="gradientHome m-10 flex flex-col items-center justify-center gap-10 rounded p-10">
      <h1>
        PUTagent <br /> wsparcie studenckie
      </h1>
      <h2>heading2</h2>
      <h3>heading3</h3>
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <ThemeButton />
    </div>
  );
}
