import { AuthLayout } from '@/components/auth/auth-layout';
import { notFound } from 'next/navigation';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ConfirmPage(props: {
  searchParams: SearchParams;
}) {
  const { type } = await props.searchParams;

  const validTypes = ['email', 'pass'];
  if (!validTypes.includes(type as string)) notFound();

  const heading = type === 'email' ? 'Potwierdź e-mail' : 'Resetowanie hasła';
  const subheading = type === 'email' ? 'aktywacyjny' : 'resetujący hasło';

  return (
    <AuthLayout title={heading}>
      <p className="text-center">
        Sprawdź swoją skrzynkę pocztową.
        <br />
        Wysłaliśmy tobie link {subheading} na podany adres e-mail.
      </p>
    </AuthLayout>
  );
}
