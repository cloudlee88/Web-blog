/** Central site configuration + copy. Keep marketing strings here, not in JSX. */

export const SITE = {
  name: "CloudPixel",
  shortName: "CloudPixel",
  tagline: "Honest, in-depth reviews of AI tools",
  description:
    "CloudPixel covers AI tools, software and digital products in depth — honest verdicts, buying guides and a transparent review process. Less noise, more signal.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/opengraph-image",
  twitter: "@cloudpixel",
  email: "hello@cloudpixel.com",
} as const;

/** Affiliate disclosure — shown next to every affiliate/coupon CTA (v2.1 §1, PDR §9). */
export const AFFILIATE_DISCLOSURE =
  "Affiliate link — CloudPixel may earn a commission if you sign up through this link.";

/**
 * Header nav — the 3 coverage pillars are shown explicitly (Verge-inspired) so
 * readers instantly grasp what CloudPixel covers. The "Cloudlee Review" item is
 * the personal-voice blog section (v2.1 §1). Search is a header icon, not a text link.
 */
export const NAV_LINKS = [
  { href: "/best", label: "Best Guides" },
  { href: "/category/tech", label: "Tech" },
  { href: "/category/ai", label: "AI" },
  { href: "/category/digital-products", label: "Digital Products" },
  { href: "/blog", label: "Cloudlee Review" },
] as const;

/** Display order for the 3 category pillars (Tech → AI → Digital Products). */
export const CATEGORY_ORDER = ["tech", "ai", "digital-products"] as const;

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "How We Review" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRICING_LABELS: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
};

/** Blog topics for affiliate product reviews (non-AI physical/entertainment products). */
export const BLOG_TOPICS = [
  { slug: "lifestyle", name: "Lifestyle" },
  { slug: "beauty-fashion", name: "Beauty & Fashion" },
  { slug: "entertainment", name: "Entertainment" },
] as const;

export const PAGE_SIZE = 12;
