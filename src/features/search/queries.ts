import "server-only";
import { prisma, safeQuery } from "@/lib/db";

export interface SearchResults {
  tools: {
    slug: string;
    name: string;
    shortDesc: string;
    logoUrl: string | null;
    rating: number;
    pricing: string;
  }[];
  posts: { slug: string; title: string; excerpt: string | null; type: string }[];
}

/**
 * Case-insensitive ILIKE search over tools + posts. Sufficient at a few-hundred
 * tool scale (TechStack §3); upgrade to Postgres FTS / Algolia later.
 */
export async function search(query: string, limit = 20): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return { tools: [], posts: [] };

  return safeQuery(
    async () => {
      const [tools, posts] = await Promise.all([
        prisma.tool.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { shortDesc: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { slug: true, name: true, shortDesc: true, logoUrl: true, rating: true, pricing: true },
          take: limit,
          orderBy: [{ featured: "desc" }, { rating: "desc" }],
        }),
        prisma.post.findMany({
          where: {
            publishedAt: { not: null, lte: new Date() },
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          },
          select: { slug: true, title: true, excerpt: true, type: true },
          take: limit,
          orderBy: { publishedAt: "desc" },
        }),
      ]);
      return { tools, posts };
    },
    { tools: [], posts: [] },
  );
}
