import "server-only";
import { Prisma } from "@prisma/client";
import { prisma, safeQuery } from "@/lib/db";
import { PAGE_SIZE } from "@/lib/constants";
import type { ToolInput } from "@/schemas/content";

/** Standard shape used by cards + detail pages (tool with category + tags). */
const toolInclude = { category: true, tags: true } satisfies Prisma.ToolInclude;

export type ToolWithRelations = Prisma.ToolGetPayload<{ include: typeof toolInclude }>;

/** Card view = tool + relations + a computed `trending` flag. */
export type ToolCard = ToolWithRelations & { trending?: boolean };

export interface ToolFilters {
  categorySlug?: string;
  tagSlug?: string;
  pricing?: "FREE" | "FREEMIUM" | "PAID";
  q?: string;
  page?: number;
  pageSize?: number;
}

function buildWhere(f: ToolFilters): Prisma.ToolWhereInput {
  const where: Prisma.ToolWhereInput = {};
  if (f.categorySlug) where.category = { slug: f.categorySlug };
  if (f.tagSlug) where.tags = { some: { slug: f.tagSlug } };
  if (f.pricing) where.pricing = f.pricing;
  if (f.q) {
    where.OR = [
      { name: { contains: f.q, mode: "insensitive" } },
      { shortDesc: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

/** Editorial ordering: featured first, then editorialRank asc, then rating desc. */
const editorialOrder: Prisma.ToolOrderByWithRelationInput[] = [
  { featured: "desc" },
  { editorialRank: { sort: "asc", nulls: "last" } },
  { rating: "desc" },
  { createdAt: "desc" },
];

export async function getTools(
  filters: ToolFilters = {},
): Promise<{ items: ToolWithRelations[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PAGE_SIZE;
  const where = buildWhere(filters);

  return safeQuery(
    async () => {
      const [items, total] = await Promise.all([
        prisma.tool.findMany({
          where,
          include: toolInclude,
          orderBy: editorialOrder,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.tool.count({ where }),
      ]);
      return { items, total, page, pageSize };
    },
    { items: [], total: 0, page, pageSize },
  );
}

export async function getFeaturedTools(limit = 6): Promise<ToolWithRelations[]> {
  return safeQuery(
    () =>
      prisma.tool.findMany({
        where: { featured: true },
        include: toolInclude,
        orderBy: editorialOrder,
        take: limit,
      }),
    [],
  );
}

export async function getToolBySlug(slug: string): Promise<ToolWithRelations | null> {
  return safeQuery(
    () => prisma.tool.findUnique({ where: { slug }, include: toolInclude }),
    null,
  );
}

/** 3–4 similar tools by shared category (fallback to shared tag). FR-2.3 */
export async function getSimilarTools(tool: ToolWithRelations, limit = 4): Promise<ToolWithRelations[]> {
  return safeQuery(
    () =>
      prisma.tool.findMany({
        where: {
          id: { not: tool.id },
          OR: [
            ...(tool.categoryId ? [{ categoryId: tool.categoryId }] : []),
            ...(tool.tags.length ? [{ tags: { some: { id: { in: tool.tags.map((t) => t.id) } } } }] : []),
          ],
        },
        include: toolInclude,
        orderBy: editorialOrder,
        take: limit,
      }),
    [],
  );
}

export interface Subtype {
  slug: string;
  name: string;
  count: number;
}

/**
 * Functional sub-categories within a pillar (e.g. within "AI": chatbot, image,
 * writing, video…). Derived from the tags actually used by tools in that
 * category, with counts — so it always reflects real content.
 */
export async function getCategorySubtypes(categorySlug: string, limit = 16): Promise<Subtype[]> {
  return safeQuery(
    async () => {
      const tools = await prisma.tool.findMany({
        where: { category: { slug: categorySlug } },
        select: { tags: { select: { slug: true, name: true } } },
      });
      const map = new Map<string, Subtype>();
      for (const t of tools) {
        for (const tag of t.tags) {
          const e = map.get(tag.slug) ?? { slug: tag.slug, name: tag.name, count: 0 };
          e.count += 1;
          map.set(tag.slug, e);
        }
      }
      return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
    },
    [],
  );
}

/**
 * Trending = most-clicked tools within the window (default 7 days), computed
 * from anonymous ClickLog (FR-4.2). Falls back to recent tools if no clicks yet.
 */
export async function getTrendingTools(limit = 6, days = 7): Promise<ToolCard[]> {
  return safeQuery(
    async () => {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const grouped = await prisma.clickLog.groupBy({
        by: ["affiliateSlug"],
        where: { createdAt: { gte: since } },
        _count: { affiliateSlug: true },
        orderBy: { _count: { affiliateSlug: "desc" } },
        take: limit,
      });

      const slugs = grouped.map((g) => g.affiliateSlug);
      if (slugs.length === 0) {
        // No click data yet — surface the newest tools instead of an empty block.
        const recent = await prisma.tool.findMany({
          include: toolInclude,
          orderBy: { createdAt: "desc" },
          take: limit,
        });
        return recent;
      }

      const tools = await prisma.tool.findMany({
        where: { affiliateSlug: { in: slugs } },
        include: toolInclude,
      });
      // Preserve the click-count ordering and tag as trending.
      const order = new Map(slugs.map((s, i) => [s, i]));
      return tools
        .sort((a, b) => (order.get(a.affiliateSlug ?? "") ?? 0) - (order.get(b.affiliateSlug ?? "") ?? 0))
        .map((t) => ({ ...t, trending: true }));
    },
    [],
  );
}

export async function getAllToolSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(
    () => prisma.tool.findMany({ select: { slug: true, updatedAt: true } }),
    [],
  );
}

/**
 * Upsert a tool from validated input (shared by /api/content + admin).
 * Resolves category + tags by slug, creating tags on the fly.
 */
export async function upsertTool(input: ToolInput): Promise<{ slug: string }> {
  const { categorySlug, tagSlugs, ...rest } = input;

  const categoryConnect = categorySlug
    ? { connect: { slug: categorySlug } }
    : undefined;

  const tagConnectOrCreate = tagSlugs.map((s) => ({
    where: { slug: s },
    create: { slug: s, name: s.replace(/-/g, " ") },
  }));

  const data = {
    ...rest,
    pros: rest.pros,
    cons: rest.cons,
    useCases: rest.useCases,
    pricingTiers: (rest.pricingTiers ?? undefined) as Prisma.InputJsonValue | undefined,
    faq: (rest.faq ?? undefined) as Prisma.InputJsonValue | undefined,
  };

  const tool = await prisma.tool.upsert({
    where: { slug: input.slug },
    create: {
      ...data,
      category: categoryConnect,
      tags: { connectOrCreate: tagConnectOrCreate },
    },
    update: {
      ...data,
      category: categorySlug ? categoryConnect : { disconnect: true },
      tags: { set: [], connectOrCreate: tagConnectOrCreate },
    },
    select: { slug: true },
  });

  return tool;
}
