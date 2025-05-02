'use client';
import { ChatInput } from '@/components/chat/chat-input';

export default function ChatInitialPage() {
  const onSubmit = async (question: string) => {
    console.log('Question submitted:', question);

    const response = await fetch('http://localhost:8000/chat/redirect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ question }),
    });

    console.log(response);
  };

  return (
    <>
      <section>
        <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
      </section>

      <ChatInput onSubmit={onSubmit} />
    </>
  );
}
