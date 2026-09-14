import { z } from "zod";

/** Reusable primitives */
const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase, hyphen-separated slug");

const pricing = z.enum(["FREE", "FREEMIUM", "PAID"]);
const postType = z.enum(["BLOG", "TUTORIAL", "NEWS"]);

const pricingTier = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  features: z.array(z.string()).default([]),
});

const faqItem = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

/** Payload for creating/updating a Tool via /api/content or admin. */
export const toolInputSchema = z.object({
  slug,
  name: z.string().min(1).max(120),
  logoUrl: z.string().url().nullish(),
  screenshotUrl: z.string().url().nullish(),
  shortDesc: z.string().min(1).max(280),
  rating: z.coerce.number().min(0).max(5).default(0),
  pricing: pricing.default("FREEMIUM"),
  editorialRank: z.coerce.number().int().positive().nullish(),
  featured: z.coerce.boolean().default(false),
  verified: z.coerce.boolean().default(false),
  verdict: z.string().max(600).nullish(),
  reviewBody: z.string().nullish(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  useCases: z.array(z.string()).default([]),
  pricingTiers: z.array(pricingTier).nullish(),
  faq: z.array(faqItem).nullish(),
  affiliateSlug: slug.nullish(),
  website: z.string().url().nullish(),
  metaTitle: z.string().max(160).nullish(),
  metaDescription: z.string().max(300).nullish(),
  categorySlug: slug.nullish(),
  tagSlugs: z.array(slug).default([]),
});

export type ToolInput = z.infer<typeof toolInputSchema>;

/** Payload for creating/updating a Post via /api/content. */
export const postInputSchema = z.object({
  slug,
  title: z.string().min(1).max(200),
  type: postType.default("BLOG"),
  excerpt: z.string().max(400).nullish(),
  coverUrl: z.string().url().nullish(),
  body: z.string().min(1),
  publishedAt: z.coerce.date().nullish(),
  metaTitle: z.string().max(160).nullish(),
  metaDescription: z.string().max(300).nullish(),
});

export type PostInput = z.infer<typeof postInputSchema>;

/** Discriminated envelope so one endpoint handles both entity types. */
export const contentEnvelopeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("tool"), data: toolInputSchema }),
  z.object({ kind: z.literal("post"), data: postInputSchema }),
]);

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  source: z.string().max(60).optional(),
});
