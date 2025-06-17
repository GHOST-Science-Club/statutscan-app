import { cookies } from 'next/headers';
import ChatClient from '@/components/chat/chat-client';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access')?.value || '';
  return <ChatClient token={token} />;
}
