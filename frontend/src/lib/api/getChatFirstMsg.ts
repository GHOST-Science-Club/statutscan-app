'use server';

async function getChatFirstMsg({ question }: { question: string }) {
  const res = await fetch(process.env.API_URL + '/chat/redirect/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ question }),
  });
  console.log(res);
  const json = await res.json();
  console.log(json);
}

export { getChatFirstMsg };
