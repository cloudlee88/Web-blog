import Image from "next/image";
import { cn } from "@/lib/utils";

/** Square tool logo with a graceful lettered fallback when no logoUrl. */
export function ToolLogo({
  name,
  logoUrl,
  size = 48,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={cn("rounded-lg border border-border bg-white object-contain", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading font-bold text-primary",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
