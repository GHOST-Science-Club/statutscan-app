'use client';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatFirstMsg } from '@/actions/getChatFirstMsg';

export default function ChatInitialPage() {
  const onSubmit = async (question: string) => {
    await getChatFirstMsg({ question });
  };

  return (
    <main className="m-auto w-full max-w-3xl text-center">
      <section>
        <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
      </section>
      <ChatInput onSubmit={onSubmit} />
    </main>
  );
}
