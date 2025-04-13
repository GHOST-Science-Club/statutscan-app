import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

function SocialButtons() {
  return (
    <ul className="mt-10 w-full space-y-4 **:w-full">
      <li>
        <Button variant="secondary">
          <Icons icon="google" />
          Kontynuuj z Google
        </Button>
      </li>
      <li>
        <Button variant="secondary">
          <Icons icon="github" />
          Kontynuuj z Github
        </Button>
      </li>
      <li>
        <Button variant="secondary">
          <Icons icon="microsoft" />
          Kontynuuj z Microsoft
        </Button>
      </li>
    </ul>
  );
}

export { SocialButtons };
