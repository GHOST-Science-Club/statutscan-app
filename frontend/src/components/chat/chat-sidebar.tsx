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

type Props = {
  items: {
    label: string;
    content: string[];
  }[];
};

export function ChatSidebar({ items }: Props) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-end justify-end pl-4">
        <Link href="/" className="mr-auto">
          <Logo />
        </Link>

        <SidebarTrigger className="size-9" />
        <Button aria-label="Nowy czat" variant="ghost" size="icon">
          <Plus />
        </Button>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          {items.map((item, i) => (
            <SidebarGroup key={i} className="px-4">
              <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2 text-ellipsis">
                {item.content.map((item, j) => (
                  <p key={j}>{item}</p>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
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
