import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TextAnimate } from '@/components/ui/text-animate';

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
      {title && (
        <TextAnimate
          startOnView
          animation="slideRight"
          className="text-primary w-full py-5"
        >
          {title}
        </TextAnimate>
      )}

      {children}
    </section>
  );
}

export { SectionLayout };
