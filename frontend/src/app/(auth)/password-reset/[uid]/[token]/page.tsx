import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetPassConfirmForm } from '@/components/auth/reset-pass-confirm-form';
import { resetPasswordMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ uid: string; token: string }>;
};

export const metadata = resetPasswordMetadata;

export default async function ResetConfirmPasswordPage({ params }: Props) {
  const { uid, token } = await params;
  return (
    <AuthLayout title="Resetuj hasło">
      <ResetPassConfirmForm uid={uid} token={token} />
    </AuthLayout>
  );
}
