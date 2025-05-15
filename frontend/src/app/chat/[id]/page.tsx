'use client';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatInput } from '@/components/chat/chat-input';
import useWebSocket from 'react-use-websocket';
import { AiMsg } from '@/components/chat/ai-msg';

interface ChatMessage {
  type: 'user' | 'assistant';
  content?: string;
  sources?: { title?: string; source: string }[];
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirected = searchParams.get('redirection') || null;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === 'assistant_answer') {
      const { message, streaming } = data;

      if (streaming) {
        const messageChunk = JSON.parse(message);
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (messageChunk.chunk && lastMessage?.type === 'assistant') {
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
              { type: 'assistant', content: messageChunk.chunk, sources: [] },
            ];
          }
          return prev;
        });
      }
    }
  };

  const { sendJsonMessage } = useWebSocket(
    `${process.env.NODE_ENV == 'production' ? 'wss' : 'ws'}://localhost:8000/ws/chat/${id}/`,
    {
      onOpen: () => console.log('connected'),
      onMessage: handleMessage,
    },
  );

  useEffect(() => {
    if (redirected) {
      router.push(pathname);
      sendJsonMessage({
        chat_id: id,
        is_redirection: true,
      });
    }
  }, []);

  const onSubmit = (message: string) => {
    console.log(message);
  };

  return (
    <>
      {messages.map(
        (msg, index) =>
          msg.type === 'assistant' && (
            <AiMsg
              key={index}
              content={msg.content || ''}
              sources={msg.sources || []}
            />
          ),
      )}
      <ChatInput onSubmit={onSubmit} />
    </>
  );
}
