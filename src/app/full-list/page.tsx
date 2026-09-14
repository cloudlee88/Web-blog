import type { Metadata } from "next";
import { getTools } from "@/features/tools/queries";
import { getCategories } from "@/features/categories/queries";
import { ToolGrid } from "@/components/tool-grid";
import { FilterBar } from "@/components/filter-bar";
import { Pagination } from "@/components/pagination";
import { buildMetadata } from "@/lib/seo";
import { PAGE_SIZE } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Full list of tools",
  description: "Browse every hand-picked, reviewed tool on Small Corner. Filter by price and category.",
  path: "/full-list",
});

export default async function FullListPage({
  searchParams,
}: {
  searchParams: { page?: string; pricing?: string; category?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pricing = searchParams.pricing as "FREE" | "FREEMIUM" | "PAID" | undefined;

  const [{ items, total }, categories] = await Promise.all([
    getTools({ page, pricing, categorySlug: searchParams.category }),
    getCategories(),
  ]);

  return (
    <div className="container py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">All tools</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Every tool we&apos;ve reviewed, in one place — {total} and counting.
        </p>
      </header>

      <div className="mb-6 space-y-3">
        <FilterBar />
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <Link
              href="/full-list"
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                !searchParams.category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-accent",
              )}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/full-list?category=${c.slug}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  searchParams.category === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-accent",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <ToolGrid tools={items} />

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        baseHref="/full-list"
        searchParams={searchParams}
      />
    </div>
  );
}
