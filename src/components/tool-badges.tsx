import { Sparkles, Flame, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRICING_LABELS } from "@/lib/constants";

export function FeaturedBadge() {
  return (
    <Badge variant="featured">
      <Sparkles className="size-3" /> Featured
    </Badge>
  );
}

export function TrendingBadge() {
  return (
    <Badge variant="trending">
      <Flame className="size-3" /> Trending
    </Badge>
  );
}

export function VerifiedBadge() {
  return (
    <Badge variant="verified">
      <BadgeCheck className="size-3" /> Tested
    </Badge>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
      #{rank}
    </span>
  );
}

export function PricingBadge({ pricing }: { pricing: string }) {
  return <Badge variant="muted">{PRICING_LABELS[pricing] ?? pricing}</Badge>;
}
