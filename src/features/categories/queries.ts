import "server-only";
import { prisma, safeQuery } from "@/lib/db";

export async function getCategories() {
  return safeQuery(
    () =>
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { tools: true } } },
      }),
    [],
  );
}

export async function getCategoryBySlug(slug: string) {
  return safeQuery(() => prisma.category.findUnique({ where: { slug } }), null);
}

export async function getCategorySlugs(): Promise<{ slug: string }[]> {
  return safeQuery(() => prisma.category.findMany({ select: { slug: true } }), []);
}
