'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatInput } from '@/components/chat/chat-input';
import { getChatFirstMsg } from '@/lib/chat/getChatFirstMsg';
import { getChat } from '@/lib/chat/getChat';
import useWebSocket from 'react-use-websocket';
import { ChatMsg } from '@/components/chat/chat-msg';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title?: string; source: string }[];
}

export default function ChatPage() {
  const chatId = useParams<{ id?: string[] }>().id?.[0] || null;
  const redirected = useSearchParams().get('redirection') || null;
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    getChat({ id: chatId }).then(res => {
      if (!res) setError('Nie można znaleźć czatu');
      else {
        setMessages(
          res.map(msg => ({
            role: msg.role,
            content: msg.content || '',
            sources: msg.sources || [],
          })),
        );
        setLoading(false);
      }
    });
  }, [chatId]);

  useEffect(() => {
    if (!redirected) return;
    router.replace(`/chat/${chatId}`);
    sendJsonMessage({
      chat_id: chatId,
      is_redirection: true,
    });
  }, [redirected]);

  const onSubmit = useCallback(
    async (question: string) => {
      setLoading(true);
      if (!chatId) {
        const error = await getChatFirstMsg({ question });
        if (error) {
          setError(error);
          setLoading(false);
        }
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
    setLoading(true);
    const data = JSON.parse(event.data);

    if (data.type == 'token_limit_reached') {
      setError(`Przekroczono limit tokenów, spróbuj po: ${data.reset_date}`);
      setLoading(false);
    }

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
      } else setLoading(false);
    }
  }, []);

  const { sendJsonMessage } = useWebSocket(
    `${process.env.NODE_ENV == 'production' ? 'wss' : 'ws'}://localhost:8000/ws/chat/${chatId}/`,
    {
      onOpen: () => console.log('ws connected'),
      onError: () => setError('Nie można połączyć się z czatem'),
      onMessage: handleMessage,
    },
    !!chatId,
  );

  return (
    <main className="mx-auto flex h-screen w-full flex-col justify-center overflow-hidden py-1 text-center">
      <div className={cn('overflow-auto', chatId && 'h-full')}>
        {chatId ? (
          <section className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-2">
            {messages.map((msg, index) => (
              <ChatMsg key={index} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </section>
        ) : (
          <section>
            <h2 className="text-gradient pb-5">Zapytaj o coś</h2>
          </section>
        )}
      </div>

      <div>
        {error && <p className="text-destructive">{error}</p>}
        <ChatInput disabled={!!error} loading={loading} onSubmit={onSubmit} />
      </div>
    </main>
  );
}
