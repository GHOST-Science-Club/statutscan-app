import { AuthLayout } from '@/components/auth/auth-layout';
import { confirmMetadata } from '@/lib/metadata';

const validType = ['email', 'pass'];

export function generateStaticParams() {
  return validType.map(t => ({
    type: t,
  }));
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { type } = await params;
  return confirmMetadata(type == 'email' ? 'email' : 'hasło');
}

export default async function ConfirmPage({ params }: Props) {
  const { type } = await params;
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
