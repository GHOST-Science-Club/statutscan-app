type Props = {
  url: string;
  headers?: HeadersInit;
  body?: object;
} & Omit<RequestInit, 'body'>;

function fetchBackend(props: Props) {
  const { url, headers, body, ...rest } = props;
  return fetch(process.env.API_URL + url, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    ...rest,
  });
}

export { fetchBackend };
