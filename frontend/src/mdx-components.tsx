import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: ({ src, alt, ...props }) => {
      return <img src={src} alt={alt} className="mx-auto" {...props} />;
    },
    code: ({ children, ...props }) => {
      return (
        <code
          className="bg-muted rounded-sm p-1 before:content-none after:content-none"
          {...props}
        >
          {children}
        </code>
      );
    },
    a: ({ children, ...props }) => (
      <a
        className="!text-primary no-underline underline-offset-4 hover:underline"
        {...props}
      >
        {children}
      </a>
    ),
    wrapper: ({ children }) => (
      <div className="**:border-border prose-neutral prose prose-sm dark:prose-invert **:text-foreground marker:text-foreground prose-headings:font-heading **:font-text w-full max-w-none p-5 sm:px-20">
        {children}
      </div>
    ),
  };
}
