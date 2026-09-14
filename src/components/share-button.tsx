"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { SITE } from "@/lib/constants";

/**
 * Share button (v2.1 §5). Uses the Web Share API on supported devices, and
 * falls back to copying the canonical URL to the clipboard.
 */
export function ShareButton({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE.url.replace(/\/$/, "")}${path}`;

  async function onShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={onShare}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium transition-colors hover:bg-accent"
      aria-label="Share"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
