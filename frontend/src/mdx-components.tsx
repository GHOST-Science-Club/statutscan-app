import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => (
      <div className="**:border-border prose-neutral prose prose-sm dark:prose-invert **:text-foreground marker:text-foreground prose-headings:font-heading **:font-text w-full max-w-none p-5 sm:px-20">
        {children}
      </div>
    ),
  };
}
