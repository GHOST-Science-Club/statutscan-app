'use client';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatFirstMsg } from '@/lib/chat/getChatFirstMsg';
import { getChat } from '@/lib/chat/getChat';
import useWebSocket from 'react-use-websocket';
import { ChatMsg } from '@/components/chat/chat-msg';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title?: string; source: string }[];
}

export default function ChatPage() {
  const chatId = useParams<{ id?: string[] }>().id?.[0] || null;
  const redirected = useSearchParams().get('redirection') || null;
  const router = useRouter();
  const pathname = usePathname();
  const wsConnectRef = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) return;
    getChat({ id: chatId }).then(res =>
      setMessages(
        res.map(msg => ({
          role: msg.role,
          content: msg.content || '',
          sources: msg.sources || [],
        })),
      ),
    );

    if (redirected) {
      router.push(pathname);
      sendJsonMessage({
        chat_id: chatId,
        is_redirection: true,
      });
    }

    wsConnectRef.current = true;

    return () => {
      wsConnectRef.current = false; // Cleanup on unmount
    };
  }, [chatId]);

  const onSubmit = useCallback(
    async (question: string) => {
      if (!chatId) {
        const error = await getChatFirstMsg({ question });
        if (error) setError(error);
      } else {
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        sendJsonMessage({
          question: question,
          chat_id: chatId,
        });
      }
    },
    [chatId],
  );

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === 'assistant_answer') {
      const { message, streaming } = data;

      if (streaming) {
        const messageChunk = JSON.parse(message);
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (messageChunk.chunk && lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: (lastMessage.content || '') + messageChunk.chunk,
              },
            ];
          } else if (messageChunk.sources) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                sources: [
                  ...(lastMessage.sources || []),
                  ...messageChunk.sources,
                ],
              },
            ];
          } else if (messageChunk.chunk) {
            return [
              ...prev,
              { role: 'assistant', content: messageChunk.chunk, sources: [] },
            ];
          }
          return prev;
        });
      }
    }
  }, []);

  const { sendJsonMessage } = useWebSocket(
    `${process.env.NODE_ENV == 'production' ? 'wss' : 'ws'}://localhost:8000/ws/chat/${chatId}/`,
    {
      onOpen: () => console.log('connected'),
      onMessage: handleMessage,
    },
    wsConnectRef.current && !!chatId,
  );

  return (
    <main className="mx-auto flex w-full flex-col justify-center py-1 text-center">
      {!chatId ? (
        <section>
          <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
        </section>
      ) : (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-2">
          {messages.map((msg, index) => (
            <ChatMsg key={index} type={msg.role} content={msg.content} />
          ))}
        </section>
      )}
      {error && <p className="text-destructive">{error}</p>}
      <ChatInput onSubmit={onSubmit} />
    </main>
  );
}
