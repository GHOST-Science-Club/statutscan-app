'use client';
import { ReactNode } from 'react';
import { motion } from 'motion/react';

type Props = {
  title: string;
  description: string;
  footer?: ReactNode;
  index: number;
};

function AboutChatItem(props: Props) {
  const { title, description, footer, index } = props;
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 60,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
      }}
      viewport={{ once: true }}
      className="h-fit rounded-sm border p-2"
    >
      <div className="flex items-start justify-between">
        <h4 className="mb-2 text-xl font-semibold">{title}</h4>
        <span className="text-muted-foreground text-sm">(0{index + 1})</span>
      </div>

      <p className="text-muted-foreground">{description}</p>
      {footer}
    </motion.div>
  );
}
export { AboutChatItem };
