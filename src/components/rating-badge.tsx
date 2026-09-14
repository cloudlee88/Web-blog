import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Consistent rating display used everywhere a tool score appears (FR-2.2). */
export function RatingBadge({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  if (!rating || rating <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-gold/15 font-semibold text-gold-foreground",
        size === "lg" ? "px-2.5 py-1 text-base" : "px-1.5 py-0.5 text-xs",
        className,
      )}
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <Star className={cn("fill-gold text-gold", size === "lg" ? "size-4" : "size-3")} />
      {rating.toFixed(1)}
    </span>
  );
}

/** Five-star row (used on the review header). */
export function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative">
            <Star className="size-4 text-muted-foreground/30" />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="size-4 fill-gold text-gold" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
