'use client';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatFirstMsg } from '@/actions/getChatFirstMsg';
import { useState } from 'react';

export default function ChatInitialPage() {
  const [error, setError] = useState();
  const onSubmit = async (question: string) => {
    const error = await getChatFirstMsg({ question });
    setError(error);
  };

  return (
    <main className="m-auto w-full max-w-3xl text-center">
      <section>
        <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
      </section>
      <p className="text-destructive">{error}</p>
      <ChatInput onSubmit={onSubmit} />
    </main>
  );
}
