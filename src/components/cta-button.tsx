"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Primary affiliate CTA (FR-3.1). Routes through /go/[slug] (cloaked, logged),
 * fires a GA4 affiliate_click event.
 * Falls back to the official website when no affiliate slug exists.
 */
export function AffiliateCTA({
  affiliateSlug,
  website,
  toolName,
  label,
  className,
}: {
  affiliateSlug?: string | null;
  website?: string | null;
  toolName: string;
  label?: string;
  className?: string;
}) {
  const href = affiliateSlug ? `/go/${affiliateSlug}` : website;
  if (!href) return null;

  const isAffiliate = Boolean(affiliateSlug);
  const text = label ?? (isAffiliate ? `Visit ${toolName}` : `Go to ${toolName}`);

  return (
    <div className={cn("space-y-2", className)}>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() => isAffiliate && affiliateSlug && track.affiliateClick(affiliateSlug, toolName)}
        className="cta-gradient group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-6 text-base font-semibold text-navy-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {text}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
