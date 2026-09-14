/**
 * Canonical category taxonomy for CloudPixel (v2.1 §2): three scope pillars.
 * Functional detail (writing, image, coding, seo, …) lives in tags, not
 * categories. Shared by prisma/seed.ts and content-import/import.ts so there's
 * one source of truth. Category slugs are referenced by tool frontmatter
 * (`categorySlug`); functional tags by `tags`.
 */
export interface SeedCategory {
  slug: string;
  name: string;
  description: string;
}

export const CATEGORIES: SeedCategory[] = [
  {
    slug: "tech",
    name: "Tech",
    description: "Software, apps and tools — the wider tech we test, increasingly AI-powered.",
  },
  {
    slug: "ai",
    name: "AI",
    description:
      "AI-native tools — assistants, generators and copilots. Reviewed by what they actually do, not the hype.",
  },
  {
    slug: "digital-products",
    name: "Digital Products",
    description: "Templates, courses and digital goods worth paying for.",
  },
];
