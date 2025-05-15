'use client';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatFirstMsg } from '@/actions/getChatFirstMsg';
import { Dispatch, SetStateAction } from 'react';

export default function ChatInitialPage() {
  const onSubmit = async (
    question: string,
    stopLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    await getChatFirstMsg({ question });
    stopLoading(false);
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
