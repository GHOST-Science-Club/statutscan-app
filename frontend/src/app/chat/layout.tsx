import { CSSProperties, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as CSSProperties
      }
    >
      <ChatSidebar />
      <div className="absolute m-2">
        <SidebarTrigger className="size-9" />
        <Button aria-label="Nowy czat" variant="ghost" size="icon" asChild>
          <Link href="/chat">
            <Plus />
          </Link>
        </Button>
      </div>
      {children}
    </SidebarProvider>
  );
}
