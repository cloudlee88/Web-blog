import type { Heading } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Sticky table of contents for long reviews (PDR §4.3). */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null; // only worth showing for longer pieces

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-heading font-semibold">On this page</p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 border-transparent py-0.5 pl-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
                h.level === 3 && "pl-6",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
