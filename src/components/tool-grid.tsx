import { ToolCard, ToolCardSkeleton } from "@/components/tool-card";
import { EmptyState } from "@/components/empty-state";
import type { ToolCard as ToolCardData } from "@/features/tools/queries";

/** Responsive grid of tool cards with a friendly empty fallback. */
export function ToolGrid({
  tools,
  emptyTitle,
  emptyDescription,
}: {
  tools: ToolCardData[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (tools.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No tools here yet"}
        description={emptyDescription ?? "Check back soon — we add hand-picked tools every week."}
        action={{ href: "/full-list", label: "Browse the full list" }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

export function ToolGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
}
