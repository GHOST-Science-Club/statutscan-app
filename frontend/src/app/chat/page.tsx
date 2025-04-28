import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Plus } from 'lucide-react';
import { ChatInput } from '@/components/chat/chat-input';

const sidebarItems = [
  {
    label: 'Lorem ipsum',
    content: [
      'Lorem ipsum dolor sit amet',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor sit amet consectetur...',
    ],
  },
  {
    label: 'Lorem ipsum',
    content: [
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor sit',
    ],
  },
  {
    label: 'Lorem ipsum',
    content: [
      'Lorem ipsum dolor',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor sit amet',
    ],
  },
  {
    label: 'Lorem ipsum',
    content: [
      'Lorem ipsum dolor sit',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor',
      'Lorem ipsum dolor sit amet consectetur...',
      'Lorem ipsum dolor sit',
    ],
  },
];

export default function ChatPage() {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as CSSProperties
      }
    >
      <ChatSidebar items={sidebarItems} />
      <div className="absolute m-2">
        <SidebarTrigger className="size-9" />
        <Button aria-label="Nowy czat" variant="ghost" size="icon">
          <Plus />
        </Button>
      </div>
      <main className="m-auto w-full max-w-xl text-center">
        <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
        <ChatInput />
      </main>
      <Button variant="primary" className="absolute right-0 m-2">
        Lorem ipsum
        <ArrowUpRight />
      </Button>
    </SidebarProvider>
  );
}
