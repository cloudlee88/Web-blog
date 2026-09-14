"use client";

import { useState } from "react";
import { Copy, Check, Tag } from "lucide-react";
import { track } from "@/lib/analytics";

/** Coupon / deal display with copy-to-clipboard (FR-3.3). Hidden if no code. */
export function CouponBlock({ code, affiliateSlug }: { code: string; affiliateSlug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      track.couponCopy(affiliateSlug);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the code is still visible to copy manually */
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-3">
      <div className="flex items-center gap-2">
        <Tag className="size-4 text-primary" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Coupon code</p>
          <p className="font-mono text-lg font-bold tracking-wider text-foreground">{code}</p>
        </div>
      </div>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        aria-label="Copy coupon code"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
