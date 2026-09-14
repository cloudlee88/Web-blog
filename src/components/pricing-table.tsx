import { Check } from "lucide-react";

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

/** Safely coerce the JSON `pricingTiers` field into typed tiers. */
export function parsePricingTiers(value: unknown): PricingTier[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is Record<string, unknown> => typeof t === "object" && t !== null)
    .map((t) => ({
      name: String(t.name ?? ""),
      price: String(t.price ?? ""),
      features: Array.isArray(t.features) ? t.features.map(String) : [],
    }))
    .filter((t) => t.name);
}

/** Responsive pricing table — stacks into cards on mobile (PDR §5). */
export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  if (tiers.length === 0) return null;

  // Highlight the middle tier (the "Business"-style plan) with a deep-blue
  // 2px border + soft blue glow (Trackit-cloud spec §7).
  const highlightIndex = tiers.length >= 3 ? 1 : -1;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier, idx) => {
        const highlighted = idx === highlightIndex;
        return (
          <div
            key={tier.name}
            className={
              highlighted
                ? "relative rounded-xl border-2 border-primary bg-accent/30 p-5 shadow-[0_16px_40px_-16px_rgba(29,78,216,0.35)]"
                : "rounded-xl border border-border bg-card p-5"
            }
          >
            {highlighted && (
              <span className="absolute -top-3 left-5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
                Best value
              </span>
            )}
            <h4 className="font-heading text-base font-semibold">{tier.name}</h4>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">{tier.price}</p>
            {tier.features.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
