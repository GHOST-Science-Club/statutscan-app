import { CSSProperties, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  children: ReactNode;
  params: Promise<{ id?: string[] }>;
};

export default async function ChatLayout(props: Props) {
  const { children, params } = props;
  const { id } = await params;
  if (id && id.length > 1) notFound();

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as CSSProperties
      }
    >
      <ChatSidebar />
      <div className="fixed m-2 space-x-1">
        <SidebarTrigger className="bg-background size-9" />
        <Button
          aria-label="Nowy czat"
          variant="ghost"
          size="icon"
          asChild
          className="bg-background"
        >
          <Link href="/chat">
            <Plus />
          </Link>
        </Button>
      </div>
      {children}
    </SidebarProvider>
  );
}
