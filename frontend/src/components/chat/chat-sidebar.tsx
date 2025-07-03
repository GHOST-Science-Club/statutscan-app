import Link from 'next/link';
import { Plus } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { DeleteChatButton } from '@/components/chat/delete-chat-button';
import { logoutUser } from '@/lib/auth/logoutUser';

type Props = {
  chats: {
    id: string;
    title: string;
  }[];
};

export async function ChatSidebar(props: Props) {
  const { chats } = props;
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
                  <div key={i} className="flex items-center justify-between">
                    <Button variant="ghost" className="flex-grow" asChild>
                      <Link
                        href={`/chat/${chat.id}`}
                        className="text-ellipsis hover:underline"
                      >
                        {chat.title}
                      </Link>
                    </Button>
                    <DeleteChatButton chatId={chat.id} />
                  </div>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={logoutUser}
          variant="outline"
          size="sm"
          className="ml-auto w-fit"
        >
          Wyloguj się
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
