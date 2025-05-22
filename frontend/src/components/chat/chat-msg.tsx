import { memo } from 'react';
import { marked } from 'marked';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title?: string; source: string }[];
};

const ChatMsg = memo(function ChatMsg(props: Props) {
  const { role, content, sources } = props;
  return (
    <article
      className={cn(
        'w-full rounded-xl px-5 py-2.5 text-left',
        role == 'user' ? 'bg-input w-fit self-end' : 'self-start',
      )}
    >
      {role == 'user' ? (
        <p className="break-words">{content}</p>
      ) : (
        <>
          <div
            className="prose prose-zinc dark:prose-invert min-w-full"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
          />
          <div>
            {sources && (
              <div className="flex gap-1">
                {sources.map((source, i) => (
                  <Link
                    key={i}
                    href={source.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm underline"
                  >
                    {source.title ?? source.source}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
});

export { ChatMsg };
