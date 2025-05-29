import { googleConfirm } from '@/lib/auth/googleConfirm';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GoogleLogin({ searchParams }: Props) {
  const state = (await searchParams).state as string;
  const code = (await searchParams).code as string;
  await googleConfirm({ state, code });
  return <div>Ładowanie</div>;
}
