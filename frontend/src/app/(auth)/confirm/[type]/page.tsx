import { AuthLayout } from '@/components/auth/auth-layout';
import { notFound } from 'next/navigation';

const validType = ['email', 'pass'];

export function generateStaticParams() {
  return validType.map(t => ({
    type: t,
  }));
}

export const dynamicParams = false;

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!validType.includes(type as string)) notFound();

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
