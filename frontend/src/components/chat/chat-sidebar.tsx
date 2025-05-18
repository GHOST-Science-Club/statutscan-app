import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CircleHelp, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { getChats } from '@/lib/chat/getChats';

export async function ChatSidebar() {
  const chats: {
    id: string;
    title: string;
  }[] = await getChats();
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-end justify-end pl-4">
        <Link href="/" className="mr-auto">
          <Logo />
        </Link>

        <SidebarTrigger className="size-9" />
        <Button aria-label="Nowy czat" variant="ghost" size="icon" asChild>
          <Link href="/chat">
            <Plus />
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          {!chats || chats.length === 0 ? (
            <p className="py-5 text-center text-sm">
              Nie utworzono żadnych czatów
            </p>
          ) : (
            <SidebarGroup className="px-4">
              <SidebarGroupLabel>Wszystkie czaty</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2 text-ellipsis">
                {chats.map((chat, i) => (
                  <Link
                    key={i}
                    href={`/chat/${chat.id}`}
                    className="text-ellipsis hover:underline"
                  >
                    {chat.title}
                  </Link>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Button
          aria-label="Pomoc"
          variant="ghost"
          size="icon"
          className="ml-auto"
        >
          <CircleHelp />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
