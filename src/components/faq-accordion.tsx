import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

/** Coerce the JSON `faq` field into typed items. */
export function parseFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
    .map((f) => ({ q: String(f.q ?? ""), a: String(f.a ?? "") }))
    .filter((f) => f.q && f.a);
}

/**
 * FAQ accordion using native <details> — keyboard accessible with no JS, and
 * good for FAQ rich snippets (PDR §4.3). Pair with faqJsonLd() on the page.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {items.map((item, i) => (
        <details key={i} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium">
            <span>{item.q}</span>
            <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
