import Link from "next/link";
import { Cloud } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Brand mark — navy rounded-square with a cloud glyph + wordmark.
 * Navy is the signature dark accent of the Trackit-style palette.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-heading text-lg font-bold text-foreground", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground shadow-sm">
        <Cloud className="size-[18px]" strokeWidth={2.5} />
      </span>
      <span>
        Cloud<span className="text-primary">Pixel</span>
      </span>
    </Link>
  );
}
