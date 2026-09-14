import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAllToolSlugs } from "@/features/tools/queries";
import { getCategorySlugs } from "@/features/categories/queries";
import { getTagSlugs } from "@/features/tags/queries";
import { getPublishedPostSlugs } from "@/features/posts/queries";
import { getGuideSlugs } from "@/features/guides/queries";

export const revalidate = 3600;

/** Auto-generated sitemap (FR-7.2). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const [tools, categories, tags, posts, guides] = await Promise.all([
    getAllToolSlugs(),
    getCategorySlugs(),
    getTagSlugs(),
    getPublishedPostSlugs(),
    getGuideSlugs(),
  ]);

  const staticPaths = [
    "",
    "/best",
    "/full-list",
    "/blog",
    "/about",
    "/methodology",
    "/affiliate-disclosure",
    "/contact",
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...tools.map((t) => ({
      url: `${base}/tools/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guides.map((g) => ({
      url: `${base}/best/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tags.map((t) => ({
      url: `${base}/tag/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
