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

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirected = searchParams.get('redirection') || null;

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === 'assistant_answer') {
      const chunk = data.message;
      const isStreaming = data.streaming;

      if (isStreaming) {
        const messageChunk = JSON.parse(chunk);
        if ('chunk' in messageChunk) {
          setMessages(prev => [...prev, messageChunk['chunk']]);
        }
      }
    }
  };

  const wsScheme = process.env.NODE_ENV == 'production' ? 'wss' : 'ws';
  const { sendJsonMessage } = useWebSocket(
    `${wsScheme}://localhost:8000/ws/chat/${id}/`,
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
      <div>{messages}</div>
      <ChatInput onSubmit={onSubmit} />
    </>
  );
}
