import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

function MainContainer(props: Props) {
  const { className, children } = props;
  return (
    <main className={cn('mx-auto max-w-7xl p-5', className)}>{children}</main>
  );
}

export { MainContainer };
