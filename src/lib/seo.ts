import type { Metadata } from "next";
import { SITE } from "./constants";

interface BuildMetaArgs {
  title?: string;
  description?: string;
  path?: string; // absolute path beginning with "/"
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/** Build a consistent Metadata object; page title falls back to the site name. */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image = SITE.ogImage,
  type = "website",
  noIndex = false,
}: BuildMetaArgs = {}): Metadata {
  const url = new URL(path, SITE.url).toString();
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type,
      images: [{ url: new URL(image, SITE.url).toString() }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [new URL(image, SITE.url).toString()],
    },
  };
}

/** JSON-LD for a tool review (Review + Product) — FR-7.4. */
export function reviewJsonLd(tool: {
  name: string;
  slug: string;
  shortDesc: string;
  rating: number;
  logoUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: tool.name,
      applicationCategory: "BusinessApplication",
      description: tool.shortDesc,
      ...(tool.logoUrl ? { image: tool.logoUrl } : {}),
    },
    ...(tool.rating > 0
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: tool.rating,
            bestRating: 5,
            worstRating: 0,
          },
        }
      : {}),
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    url: new URL(`/tools/${tool.slug}`, SITE.url).toString(),
  };
}

/** JSON-LD for an FAQ block (rich snippet). */
export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** JSON-LD for an article/blog post. */
export function articleJsonLd(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  coverUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    url: new URL(`/blog/${post.slug}`, SITE.url).toString(),
  };
}
