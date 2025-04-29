import { ChatInput } from '@/components/chat/chat-input';
import { notFound } from 'next/navigation';

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirected: string }>;
}) {
  const { id } = await params;
  const { redirected } = await searchParams;
  if (id && id.length > 1) notFound();
  const chatid = id ? id[0] : null;

  return (
    <>
      <section>
        <h2 className="text-gradient pb-5">
          {chatid ?? 'Zapytaj o coś'} {redirected && 'redirected'}
        </h2>
      </section>

      <ChatInput />
    </>
  );
}
