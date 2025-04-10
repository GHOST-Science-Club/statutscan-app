import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  title?: string;
  className?: string;
};
function SectionLayout(props: Props) {
  const { children, title, className } = props;
  return (
    <section className={cn('p-10 sm:p-5', className)}>
      <p className="text-primary w-full py-5">{title}</p>
      {children}
    </section>
  );
}
export { SectionLayout };
