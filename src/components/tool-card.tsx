import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingBadge } from "@/components/rating-badge";
import { ToolLogo } from "@/components/tool-logo";
import {
  FeaturedBadge,
  TrendingBadge,
  VerifiedBadge,
  PricingBadge,
} from "@/components/tool-badges";
import type { ToolCard as ToolCardData } from "@/features/tools/queries";

/** The core directory card (FR-1.1): logo, blurb, tags, badges, Details + Visit. */
export function ToolCard({ tool }: { tool: ToolCardData }) {
  const visitHref = tool.affiliateSlug ? `/go/${tool.affiliateSlug}` : tool.website;

  return (
    <Card className="group flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <ToolLogo name={tool.name} logoUrl={tool.logoUrl} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/tools/${tool.slug}`}
              className="truncate font-heading text-base font-semibold hover:text-primary"
            >
              {tool.name}
            </Link>
            <RatingBadge rating={tool.rating} />
          </div>
          {tool.category && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{tool.category.name}</p>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground">{tool.shortDesc}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.featured && <FeaturedBadge />}
        {tool.trending && <TrendingBadge />}
        {tool.verified && <VerifiedBadge />}
        <PricingBadge pricing={tool.pricing} />
        {tool.tags.slice(0, 2).map((t) => (
          <Link key={t.id} href={`/tag/${t.slug}`}>
            <Badge variant="outline" className="hover:bg-accent">
              {t.name}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Details
        </Link>
        {visitHref && (
          <a
            href={visitHref}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="cta-gradient inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg text-sm font-medium text-navy-foreground"
          >
            Visit <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </Card>
  );
}

/** Skeleton placeholder for loading states (PDR §7). */
export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="size-12 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
