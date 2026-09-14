import Link from "next/link";
import type { Metadata } from "next";
import { search } from "@/features/search/queries";
import { getFeaturedTools } from "@/features/tools/queries";
import { SearchBar } from "@/components/search-bar";
import { ToolLogo } from "@/components/tool-logo";
import { RatingBadge } from "@/components/rating-badge";
import { EmptyState } from "@/components/empty-state";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search hand-picked AI tools and articles on Small Corner.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const results = q ? await search(q) : { tools: [], posts: [] };
  const hasResults = results.tools.length > 0 || results.posts.length > 0;
  const suggestions = !q || !hasResults ? await getFeaturedTools(4) : [];

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight">Search</h1>
      <SearchBar defaultValue={q} autoFocus />

      {q && (
        <p className="mt-4 text-sm text-muted-foreground">
          {hasResults
            ? `Results for “${q}”`
            : `No results for “${q}”. Try a different keyword.`}
        </p>
      )}

      {hasResults && (
        <div className="mt-6 space-y-8">
          {results.tools.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-lg font-semibold">Tools</h2>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {results.tools.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50"
                    >
                      <ToolLogo name={t.name} logoUrl={t.logoUrl} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{t.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{t.shortDesc}</p>
                      </div>
                      <RatingBadge rating={t.rating} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.posts.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-lg font-semibold">Articles</h2>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {results.posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block p-3 transition-colors hover:bg-accent/50"
                    >
                      <p className="font-medium">{p.title}</p>
                      {p.excerpt && (
                        <p className="truncate text-sm text-muted-foreground">{p.excerpt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {(!q || !hasResults) && suggestions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-heading text-lg font-semibold">
            {q ? "Popular tools you might like" : "Popular right now"}
          </h2>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {suggestions.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50"
                >
                  <ToolLogo name={t.name} logoUrl={t.logoUrl} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{t.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{t.shortDesc}</p>
                  </div>
                  <RatingBadge rating={t.rating} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!q && suggestions.length === 0 && (
        <div className="mt-10">
          <EmptyState
            title="Start typing to search"
            description="Search across every tool and article on Small Corner."
          />
        </div>
      )}
    </div>
  );
}
