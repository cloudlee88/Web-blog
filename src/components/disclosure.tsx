import Link from "next/link";
import { Info } from "lucide-react";
import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The affiliate disclosure line. Required next to EVERY affiliate/coupon CTA
 * (PRD FR-3.1, PDR §9, TechStack rule 4). Never hide this.
 */
export function Disclosure({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-xs leading-snug text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3 shrink-0" />
      <span>
        {AFFILIATE_DISCLOSURE}{" "}
        <Link href="/affiliate-disclosure" className="underline underline-offset-2">
          Learn more
        </Link>
        .
      </span>
    </p>
  );
}
