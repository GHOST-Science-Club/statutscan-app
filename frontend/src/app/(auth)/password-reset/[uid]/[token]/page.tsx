import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetPassConfirmForm } from '@/components/auth/reset-pass-confirm-form';

type Params = {
  uid: string;
  token: string;
};

export default async function ResetConfirmPasswordPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid, token } = await params;
  return (
    <AuthLayout title="Resetuj hasło">
      <ResetPassConfirmForm uid={uid} token={token} />
    </AuthLayout>
  );
}
