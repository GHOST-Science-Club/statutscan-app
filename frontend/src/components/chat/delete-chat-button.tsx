'use client';
import { useRouter, usePathname, redirect } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteChat } from '@/lib/api';
import { toast } from 'sonner';

function DeleteChatButton({ chatId }: { chatId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleOnClick = async () => {
    const success = await deleteChat(chatId);
    if (success) {
      toast.success('Czat został usunięty');
      if (`/chat/${chatId}` == pathname) redirect('/chat');
      else router.refresh();
    }
    toast.error('Nie udało się usunąć czatu');
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
