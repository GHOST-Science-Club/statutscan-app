import { ReactNode } from 'react';
import { SocialButtons } from '@/components/auth/social-buttons';

type Props = {
  children: ReactNode;
  title: string;
  description?: ReactNode;
  social?: boolean;
};
function AuthLayout(props: Props) {
  const { children, title, description, social } = props;
  return (
    <>
      <h1 className="mb-10 text-3xl text-nowrap sm:text-5xl">{title}</h1>
      {children}
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {social && <SocialButtons />}
    </>
  );
}

export { AuthLayout };
