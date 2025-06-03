'use server';

import { fetchBackend } from '@/lib/fetchBackend';

type Props = {
  state: string;
  code: string;
};

const googleConfirm = async (props: Props) => {
  const { state, code } = props;
  console.log(state, code);
  const res = await fetchBackend({
    credentials: 'include',
    method: 'POST',
    url: `/api/o/google-oauth2/?state=${state}&code=${code}`,
  });
  const json = await res.json();
  console.log('Google confirm error: ', json);
};

export { googleConfirm };
