/**
 * Decorative hero background layers (Trackit-cloud spec §2) — purely
 * presentational, low-opacity, behind the hero content:
 *   glow corners (on .hero-band) · dot-grid (top-right) · radiating sunburst
 *   lines from the corners · concentric rings behind the CTA · sparkle stars.
 * All aria-hidden + pointer-events-none so text stays fully legible.
 */

function Sparkle({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0c.7 5.3 2.7 7.3 8 8-5.3.7-7.3 2.7-8 8-.7-5.3-2.7-7.3-8-8 5.3-.7 7.3-2.7 8-8Z" />
    </svg>
  );
}

export function HeroDecoration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Radiating sunburst lines from the four corners */}
      <svg
        className="absolute inset-0 h-full w-full text-foreground/[0.06]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g stroke="currentColor" strokeWidth="0.15" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="46" y2="34" />
          <line x1="0" y1="0" x2="34" y2="46" />
          <line x1="0" y1="0" x2="52" y2="20" />
          <line x1="100" y1="0" x2="54" y2="34" />
          <line x1="100" y1="0" x2="66" y2="46" />
          <line x1="100" y1="0" x2="48" y2="20" />
          <line x1="0" y1="100" x2="46" y2="66" />
          <line x1="100" y1="100" x2="54" y2="66" />
        </g>
      </svg>

      {/* Dot-grid — top-right corner, fading toward the interior */}
      <svg
        className="absolute right-0 top-0 h-44 w-72 text-primary/30"
        style={{
          maskImage: "radial-gradient(150px 130px at 100% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(150px 130px at 100% 0%, black, transparent)",
        }}
      >
        <defs>
          <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* Concentric rings — "ripple" behind the search / CTA */}
      <svg
        className="absolute left-1/2 top-[58%] size-[520px] -translate-x-1/2 -translate-y-1/2 text-foreground/[0.07]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="200" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Sparkle stars — scattered */}
      <Sparkle className="absolute left-[12%] top-[30%] text-primary/40" size={16} />
      <Sparkle className="absolute right-[16%] top-[24%] text-primary/30" size={11} />
      <Sparkle className="absolute left-[22%] top-[64%] text-primary/25" size={9} />
      <Sparkle className="absolute right-[24%] bottom-[18%] text-primary/35" size={13} />
    </div>
  );
}
