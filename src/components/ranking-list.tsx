import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { RatingBadge } from "@/components/rating-badge";
import { ToolLogo } from "@/components/tool-logo";
import { RankBadge } from "@/components/tool-badges";
import { cn } from "@/lib/utils";
import type { ToolCard } from "@/features/tools/queries";

const ACCENTS: Record<string, string> = {
  violet: "bg-primary", // brand blue — editor's picks
  coral: "bg-[#F97316]", // orange — trending / hot (Trackit badge accent)
  blue: "bg-[#12B76A]", // green — top rated (growth/positive)
};

/** Top-N ranking block used at the bottom of Home (FR-1.2 / PDR §4.1). */
export function RankingList({
  title,
  tools,
  seeAllHref,
  icon: Icon,
  accent = "violet",
}: {
  title: string;
  tools: ToolCard[];
  seeAllHref?: string;
  icon?: LucideIcon;
  accent?: "violet" | "coral" | "blue";
}) {
  if (tools.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_16px_40px_-20px_rgba(16,24,40,0.16)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className={cn("icon-chip size-9 rounded-lg", ACCENTS[accent])}>
              <Icon className="size-5" />
            </span>
          )}
          <h3 className="font-heading text-base font-semibold">{title}</h3>
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs font-medium text-primary hover:underline">
            See all
          </Link>
        )}
      </div>
      <ol className="divide-y divide-border">
        {tools.map((tool, i) => (
          <li key={tool.id}>
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 py-2.5 transition-colors hover:text-primary"
            >
              <RankBadge rank={i + 1} />
              <ToolLogo name={tool.name} logoUrl={tool.logoUrl} size={28} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{tool.name}</span>
              <RatingBadge rating={tool.rating} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
