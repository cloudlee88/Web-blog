import "server-only";
import { Prisma, type PostType } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { PAGE_SIZE } from "@/lib/constants";
import type { PostInput } from "@/schemas/content";

export async function getPosts(
  opts: {
    type?: PostType;
    topic?: string;
    /** Pass a slug to filter to that section, or `null` to get only blog (uncategorized) posts. */
    categorySlug?: string | null;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const categoryFilter =
    opts.categorySlug === null
      ? { categorySlug: null }
      : opts.categorySlug
        ? { categorySlug: opts.categorySlug }
        : {};
  const where: Prisma.PostWhereInput = {
    publishedAt: { not: null, lte: new Date() },
    ...(opts.type ? { type: opts.type } : {}),
    ...(opts.topic ? { topic: opts.topic } : {}),
    ...categoryFilter,
  };

  return safeQuery(
    async () => {
      const [items, total] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.post.count({ where }),
      ]);
      return { items, total, page, pageSize };
    },
    { items: [], total: 0, page, pageSize },
  );
}

export async function getPostBySlug(slug: string) {
  return safeQuery(() => prisma.post.findUnique({ where: { slug } }), null);
}

export async function getPublishedPostSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () =>
      prisma.post.findMany({
        where: { publishedAt: { not: null, lte: new Date() } },
        select: { slug: true, updatedAt: true },
      }),
    [],
  );
}

export async function upsertPost(input: PostInput): Promise<{ slug: string }> {
  return prisma.post.upsert({
    where: { slug: input.slug },
    create: input,
    update: input,
    select: { slug: true },
  });
}
