import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { X } from "lucide-react";
import { getCategoryBySlug, getCategorySlugs } from "@/features/categories/queries";
import { getTools, getCategorySubtypes } from "@/features/tools/queries";
import { ToolGrid } from "@/components/tool-grid";
import { FilterBar } from "@/components/filter-bar";
import { Pagination } from "@/components/pagination";
import { buildMetadata } from "@/lib/seo";
import { PAGE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SUBCATEGORIES } from "@/lib/subcategories";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCategorySlugs()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return buildMetadata({ title: "Category not found", noIndex: true });
  return buildMetadata({
    title: `${category.name} tools`,
    description: category.description || `Hand-picked, reviewed ${category.name} tools.`,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; pricing?: string; type?: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const page = Number(searchParams.page) || 1;
  const pricing = searchParams.pricing as "FREE" | "FREEMIUM" | "PAID" | undefined;
  const type = searchParams.type;

  const [liveSubtypes, { items, total }] = await Promise.all([
    getCategorySubtypes(category.slug),
    getTools({ categorySlug: category.slug, tagSlug: type, page, pricing }),
  ]);

  // Prefer a curated taxonomy for this pillar (e.g. Digital Products); merge in
  // live counts. Otherwise use the purely data-driven sub-categories.
  const curated = SUBCATEGORIES[category.slug];
  const countBySlug = new Map(liveSubtypes.map((s) => [s.slug, s.count]));
  const subtypes = curated
    ? curated.map((c) => ({ slug: c.slug, name: c.name, count: countBySlug.get(c.slug) ?? 0 }))
    : liveSubtypes;

  const activeType = type ? subtypes.find((s) => s.slug === type) : undefined;
  const base = `/category/${category.slug}`;

  return (
    <div className="container py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
          {activeType && <span className="text-muted-foreground"> · {activeType.name}</span>}
        </h1>
        {category.description && !activeType && (
          <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>
        )}
      </header>

      {/* Browse by type — functional sub-categories within this pillar */}
      {subtypes.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Browse {category.name} by type
          </h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            <Link
              href={base}
              className={cn(
                "rounded-xl border px-4 py-3 transition-colors",
                !type
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/40 hover:bg-accent/40",
              )}
            >
              <span className="block font-medium">All types</span>
              <span className="text-xs text-muted-foreground">
                {total > 0 ? `${total} tools` : "Browse all"}
              </span>
            </Link>
            {subtypes.map((s) => (
              <Link
                key={s.slug}
                href={`${base}?type=${s.slug}`}
                className={cn(
                  "rounded-xl border px-4 py-3 transition-colors",
                  type === s.slug
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <span className="block font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">
                  {s.count > 0 ? `${s.count} ${s.count === 1 ? "tool" : "tools"}` : "Explore"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <FilterBar />
        {activeType && (
          <Link
            href={base}
            className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-sm hover:bg-accent"
          >
            <X className="size-3.5" /> Clear “{activeType.name}”
          </Link>
        )}
      </div>

      <ToolGrid
        tools={items}
        emptyTitle={`No ${activeType ? activeType.name + " " : ""}${category.name} tools yet`}
        emptyDescription="Try another type, or check back soon — we add tools every week."
      />

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        baseHref={base}
        searchParams={searchParams}
      />
    </div>
  );
}
