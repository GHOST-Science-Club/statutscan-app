'use client';

import { ArrowUp, Loader } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { Button } from '@/components/ui/button';

function ChatInput() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
    maxHeight: 200,
  });

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);

    setInputValue('');
    adjustHeight(true);

    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Textarea
        ref={textareaRef}
        id="chat-main-input"
        placeholder="Zapytaj mnie o coś"
        className="min-h-[56px] w-full resize-none rounded-md border-none py-4 pr-12 pl-6 leading-[1.2] text-wrap"
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
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <ArrowUp
            className={cn(
              'transition-opacity',
              inputValue ? 'opacity-100' : 'opacity-30',
            )}
          />
        )}
      </Button>
    </div>
  );
}

export { ChatInput };
