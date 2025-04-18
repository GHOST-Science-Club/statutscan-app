'use client';

import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { Button } from '@/components/ui/button';

function ChatInput() {
  const [inputValue, setInputValue] = useState('');
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
    maxHeight: 200,
  });

  const handleSubmit = () => {
    setInputValue('');
    adjustHeight(true);
  };

  return (
    <div className="relative mx-auto w-full min-w-sm">
      <Textarea
        ref={textareaRef}
        id="chat-main-input"
        placeholder="Zapytaj mnie o coś"
        className="min-h-[56px] w-full resize-none rounded-3xl border-none py-4 pr-12 pl-6 leading-[1.2] text-wrap"
        value={inputValue}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            if (e.shiftKey) return;
            e.preventDefault();
            handleSubmit();
          }
        }}
        onChange={e => {
          setInputValue(e.target.value);
          adjustHeight();
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-xl"
      >
        <ArrowUp
          className={cn(
            'size-4 transition-opacity',
            inputValue ? 'opacity-100' : 'opacity-30',
          )}
        />
      </Button>
    </div>
  );
}

export { ChatInput };
