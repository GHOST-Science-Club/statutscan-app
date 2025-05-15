import { marked } from 'marked';
import { cn } from '@/lib/utils';

type Props = {
  type: 'user' | 'assistant';
  content: string;
  sources?: { title?: string; source: string }[];
};

function ChatMsg(props: Props) {
  const { type, content, sources } = props;

  return (
    <section
      className={cn(
        'mx-1 my-2 max-w-full rounded-xl px-5 py-2 text-left',
        type == 'user' ? 'self-end border' : 'bg-input self-start',
      )}
    >
      {type == 'user' ? (
        <p className="break-words">{content}</p>
      ) : (
        <div
          className="prose prose-zinc dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
        />
      )}
    </section>
  );
}

export { ChatMsg };
