import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function ChatTextarea() {
  return (
    <form className="mt-auto px-2">
      <div className="border-input mt-8 mb-2 flex h-fit max-h-24 min-h-11 w-full rounded-sm border focus-within:outline">
        <label className="sr-only" htmlFor="chat-main-textarea">
          Chat text area
        </label>
        <textarea
          id="chat-main-textarea"
          placeholder="Zapytaj o coś"
          className="w-full resize-none p-2 focus:outline-0"
        />
        <div className="my-auto px-2">
          <Button size="icon" className="size-7 rounded-full">
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-center text-xs">
        Lorem ipsum dolor sit amet consectetur. Dui non risus sagittis dolor
        vestibulum cursus montes
      </p>
    </form>
  );
}
