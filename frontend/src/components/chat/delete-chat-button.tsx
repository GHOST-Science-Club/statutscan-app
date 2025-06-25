'use client';
import { useRouter, usePathname, redirect } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteChat } from '@/lib/api';

function DeleteChatButton({ chatId }: { chatId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleOnClick = async () => {
    const success = await deleteChat(chatId);
    if (success) {
      console.log(pathname);
      if (`/chat/${chatId}` == pathname) {
        redirect('/chat');
      }
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleOnClick}
      variant="ghost"
      size="icon"
      aria-label="Usuń czat"
    >
      <Trash2 />
    </Button>
  );
}

export { DeleteChatButton };
