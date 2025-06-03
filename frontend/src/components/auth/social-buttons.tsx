'use client';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { handleGoogleSignIn } from '@/lib/auth/googleSignIn';

function SocialButtons() {
  return (
    <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn}>
      <Icons icon="google" />
      Kontynuuj z Google
    </Button>
  );
}
export { SocialButtons };
