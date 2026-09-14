import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Flatten React children to a plain string (for heading id generation). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

/**
 * Renders markdown (stored in the DB) with GFM support and stable heading ids
 * that match extractHeadings(), so the table of contents anchors correctly.
 */
export function MarkdownContent({
  content,
  className,
}: {
  content: string | null | undefined;
  className?: string;
}) {
  if (!content) return null;

  const seen = new Map<string, number>();
  const idFor = (children: ReactNode) => {
    let id = slugify(textOf(children));
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    return count > 0 ? `${id}-${count}` : id;
  };

  return (
    <div className={cn("prose-review", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ children }) => <h2 id={idFor(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={idFor(children)}>{children}</h3>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer nofollow">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
