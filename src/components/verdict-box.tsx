import { Check, X } from "lucide-react";
import { StarRow } from "@/components/rating-badge";
import { AffiliateCTA } from "@/components/cta-button";
import { CouponBlock } from "@/components/coupon-block";

/**
 * VerdictBox (v2.1 §3.2 / FR-2.6) — the scannable, above-the-fold summary at the
 * top of a review: big score + The Good / The Bad + verdict + affiliate CTA +
 * disclosure. Designed to be understood in ~5 seconds.
 */
export function VerdictBox({
  name,
  rating,
  verdict,
  pros,
  cons,
  affiliateSlug,
  website,
  coupon,
}: {
  name: string;
  rating: number;
  verdict?: string | null;
  pros: string[];
  cons: string[];
  affiliateSlug?: string | null;
  website?: string | null;
  coupon?: string | null;
}) {
  return (
    <section
      aria-label="Verdict summary"
      className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* Score */}
        {rating > 0 && (
          <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-1 sm:border-r sm:border-border sm:pr-6">
            <div className="flex size-20 flex-col items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <span className="font-heading text-3xl font-bold leading-none">
                {rating.toFixed(1)}
              </span>
              <span className="text-[0.65rem] uppercase tracking-wide opacity-80">out of 5</span>
            </div>
            <div className="sm:mt-2">
              <StarRow rating={rating} />
            </div>
          </div>
        )}

        {/* Verdict */}
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-primary">
            Our verdict
          </p>
          <p className="mt-1 text-lg leading-relaxed">
            {verdict ?? `Read our full hands-on review of ${name} below.`}
          </p>
        </div>
      </div>

      {/* The Good / The Bad */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-6">
            <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-emerald-700">
              <Check className="size-4" /> The Good
            </h3>
            <ul className="space-y-1.5">
              {pros.slice(0, 4).map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card p-6">
            <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-rose-700">
              <X className="size-4" /> The Bad
            </h3>
            <ul className="space-y-1.5">
              {cons.slice(0, 4).map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="mt-0.5 size-4 shrink-0 text-rose-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* CTA + coupon + disclosure */}
      <div className="border-t border-border bg-accent/40 p-6">
        <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
          <AffiliateCTA affiliateSlug={affiliateSlug} website={website} toolName={name} />
          {coupon && affiliateSlug && <CouponBlock code={coupon} affiliateSlug={affiliateSlug} />}
        </div>
      </div>
    </section>
  );
}
