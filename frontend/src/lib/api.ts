'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import wretch from 'wretch';

const api = async () => {
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;

  return wretch(process.env.API_URL)
    .content('application/json')
    .auth(`Bearer ${access}`)
    .catcherFallback(err => {
      console.log('API error:', err);
    });
};

//CHAT

async function getChatFirstMsg(question: string) {
  const API = await api();
  const json: {
    redirect_url?: string;
    detail?: string;
  } = await API.post({ question }, '/chat/redirect/').json();
  if (json.redirect_url) redirect(json.redirect_url);
  return json.detail as string;
}

async function getChat(id: string) {
  const API = await api();
  const json: {
    title: string;
    chat_history: {
      role: 'user' | 'assistant';
      content: string;
      sources?: { title?: string; source: string }[];
    }[];
  } = await API.get(`/chat/${id}`).json();
  return json;
}

async function getChats() {
  const API = await api();
  const json: {
    chats: {
      creation_date: string;
      id: string;
      title: string;
    }[];
  } = await API.get('/chats/').json();
  console.log(json);
  return json.chats;
}

export { getChatFirstMsg, getChat, getChats };

export { api };
