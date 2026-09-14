import "server-only";
import { prisma, safeQuery } from "@/lib/db";
import type { ToolWithRelations } from "@/features/tools/queries";

/** One ranked entry in a guide's `items` JSON. */
export interface GuideItem {
  toolSlug: string;
  rank: number;
  miniVerdict: string;
  score?: number;
}

/** A guide item resolved to its live Tool (or null if the tool is missing). */
export interface ResolvedGuideItem extends GuideItem {
  tool: ToolWithRelations | null;
}

/** Coerce the JSON `items` field into typed, rank-sorted guide items. */
export function parseGuideItems(value: unknown): GuideItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((i): i is Record<string, unknown> => typeof i === "object" && i !== null)
    .map((i, idx) => ({
      toolSlug: String(i.toolSlug ?? ""),
      rank: typeof i.rank === "number" ? i.rank : idx + 1,
      miniVerdict: String(i.miniVerdict ?? ""),
      score: typeof i.score === "number" ? i.score : undefined,
    }))
    .filter((i) => i.toolSlug)
    .sort((a, b) => a.rank - b.rank);
}

export async function getGuides() {
  return safeQuery(() => prisma.guide.findMany({ orderBy: { updatedAt: "desc" } }), []);
}

export async function getGuideBySlug(slug: string) {
  return safeQuery(() => prisma.guide.findUnique({ where: { slug } }), null);
}

export async function getGuideSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return safeQuery(() => prisma.guide.findMany({ select: { slug: true, updatedAt: true } }), []);
}

/** Resolve a guide's items to live Tools (single query), preserving rank order. */
export async function resolveGuideItems(items: GuideItem[]): Promise<ResolvedGuideItem[]> {
  if (items.length === 0) return [];
  const slugs = items.map((i) => i.toolSlug);
  const tools = await safeQuery(
    () => prisma.tool.findMany({ where: { slug: { in: slugs } }, include: { category: true, tags: true } }),
    [] as ToolWithRelations[],
  );
  const bySlug = new Map(tools.map((t) => [t.slug, t]));
  return items.map((i) => ({ ...i, tool: bySlug.get(i.toolSlug) ?? null }));
}
