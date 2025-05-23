import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';

type Props = {
  content: string;
};

const ChatUserMsg = memo(function ChatMsg(props: Props) {
  const { content } = props;
  return (
    <AnimatePresence>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-input w-fit self-end rounded-xl px-5 py-2.5 text-left"
      >
        <p className="break-words">{content}</p>
      </motion.article>
    </AnimatePresence>
  );
});

export { ChatUserMsg };
