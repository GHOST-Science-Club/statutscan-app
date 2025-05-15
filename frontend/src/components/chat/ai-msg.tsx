import { marked } from 'marked';

type Props = {
  content: string;
  sources?: { title?: string; source: string }[];
};

function AiMsg(props: Props) {
  const { content, sources } = props;

  return (
    <section className="bg-input mx-1 my-2 rounded-sm p-1 text-left">
      <div
        className="prose prose-zinc dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      />
    </section>
  );
}

export { AiMsg };
