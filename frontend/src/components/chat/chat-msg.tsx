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
    <article
      className={cn(
        'mx-1 my-2 w-fit rounded-xl px-5 py-2 text-left',
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
    </article>
  );
}

export { ChatMsg };
