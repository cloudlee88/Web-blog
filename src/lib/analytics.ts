"use client";

/**
 * Lightweight GA4 event helper. No-ops when NEXT_PUBLIC_GA_ID is unset or gtag
 * is not yet on the page. Used for FR-8.2 events (affiliate click, newsletter,
 * search).
 */
type GtagFn = (command: "event", action: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(action: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}

export const track = {
  affiliateClick: (slug: string, toolName?: string) =>
    trackEvent("affiliate_click", { affiliate_slug: slug, tool_name: toolName }),
  newsletterSubmit: (source: string) => trackEvent("newsletter_submit", { source }),
  search: (query: string) => trackEvent("search", { search_term: query }),
  couponCopy: (slug: string) => trackEvent("coupon_copy", { affiliate_slug: slug }),
};
