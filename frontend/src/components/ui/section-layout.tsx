import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  title?: string;
  id?: string;
  className?: string;
};
function SectionLayout(props: Props) {
  const { children, title, id, className } = props;
  return (
    <section id={id} className={cn('md:p-10', className)}>
      <p className="text-primary w-full py-5">{title}</p>
      {children}
    </section>
  );
}
export { SectionLayout };
