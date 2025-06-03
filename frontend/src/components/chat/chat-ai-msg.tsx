import { memo } from 'react';
import { marked } from 'marked';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  content: string;
  sources?: { title?: string; source: string }[];
  error?: boolean;
};

const ChatAiMsg = memo(function ChatMsg(props: Props) {
  const { content, sources, error } = props;
  return (
    <article className="w-full self-start rounded-xl px-5 py-2.5 text-left">
      <div
        className={cn(
          'prose prose-zinc dark:prose-invert prose-a:text-primary prose-pre:text-foreground prose-code:bg-muted prose-code:rounded-md prose-pre:bg-muted min-w-full',
          error && 'text-destructive',
        )}
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />
      {sources && sources.length > 0 && (
        <div className="text-muted-foreground mt-4 flex flex-col gap-1 text-sm">
          <p>Źródła:</p>
          {sources.map((source, i) => (
            <Link
              key={i}
              href={source.source}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-ellipsis underline duration-300"
            >
              {source.title ?? source.source}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
});

export { ChatAiMsg };
