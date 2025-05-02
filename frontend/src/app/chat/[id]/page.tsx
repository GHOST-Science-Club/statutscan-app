import { ChatInput } from '@/components/chat/chat-input';

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirected: string }>;
}) {
  const { id } = await params;
  const { redirected } = await searchParams;
  return (
    <>
      <section>
        <h2 className="text-gradient pb-5">
          {id} {redirected && 'redirected'}
        </h2>
      </section>

      <ChatInput />
    </>
  );
}
