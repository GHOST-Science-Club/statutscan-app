'use client';

import { ArrowUp, Loader } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { Button } from '@/components/ui/button';

type Props = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

function ChatInput({ disabled, loading, onSubmit }: Props) {
  const [inputValue, setInputValue] = useState('');
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
    maxHeight: 200,
  });

  const handleSubmit = () => {
    if (loading || disabled) return;
    if (inputValue == '') return;
    setInputValue('');
    adjustHeight(true);
    onSubmit(inputValue);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl p-2">
      <Textarea
        ref={textareaRef}
        id="chat-main-input"
        placeholder="Zapytaj mnie o coś"
        aria-label="Główne pole tesktowe czatu"
        className="min-h-[56px] w-full resize-none rounded-md py-4 pr-12 pl-3 leading-[1.2] text-wrap sm:pl-6"
        value={inputValue}
        disabled={disabled}
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
        aria-label="Wyślij wiadomość do czatu"
        className={cn(
          'absolute top-1/2 right-3 -translate-y-1/2 rounded-full transition-opacity',
          inputValue ? 'opacity-100' : 'opacity-30',
        )}
        disabled={loading || disabled}
        onClick={handleSubmit}
      >
        {loading ? <Loader className="animate-spin" /> : <ArrowUp />}
      </Button>
    </div>
  );
}

export { ChatInput };
