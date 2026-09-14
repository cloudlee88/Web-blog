import "server-only";
import { prisma, safeQuery } from "@/lib/db";

export async function getTagBySlug(slug: string) {
  return safeQuery(() => prisma.tag.findUnique({ where: { slug } }), null);
}

export async function getPopularTags(limit = 20) {
  return safeQuery(
    () =>
      prisma.tag.findMany({
        orderBy: { tools: { _count: "desc" } },
        include: { _count: { select: { tools: true } } },
        take: limit,
      }),
    [],
  );
}

export async function getTagSlugs(): Promise<{ slug: string }[]> {
  return safeQuery(() => prisma.tag.findMany({ select: { slug: true } }), []);
}
