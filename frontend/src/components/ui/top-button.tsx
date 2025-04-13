'use client';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

function TopButton() {
  return (
    <Button
      variant="primary"
      size="icon"
      className="rounded-full"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp />
    </Button>
  );
}
export { TopButton };
