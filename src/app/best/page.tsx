import Link from "next/link";
import type { Metadata } from "next";
import { ListChecks, ArrowRight } from "lucide-react";
import { getGuides, parseGuideItems } from "@/features/guides/queries";
import { getPosts } from "@/features/posts/queries";
import { EmptyState } from "@/components/empty-state";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Best AI Tool Guides",
  description:
    "Ranked, hands-on buying guides — the best AI tools for writing, images, coding and more, with honest verdicts.",
  path: "/best",
});

export default async function BestGuidesPage() {
  const guides = await getGuides();
  const { items: bestOfPosts } = await getPosts({ categorySlug: "buying-guides", pageSize: 60 });

  return (
    <div className="container py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="display-title text-4xl sm:text-5xl">Best-of Guides</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Ranked shortlists for the questions people actually search — the best tool for each job,
          with the honest reasons why.
        </p>
      </header>

      {guides.length === 0 && bestOfPosts.length === 0 ? (
        <EmptyState
          title="No guides yet"
          description="Buying guides are on the way. In the meantime, browse the full list of reviews."
          action={{ href: "/full-list", label: "Browse all tools" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Structured buying guides (ranked tool shortlists) */}
          {guides.map((g) => {
            const count = parseGuideItems(g.items).length;
            return (
              <Link
                key={g.id}
                href={`/best/${g.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ListChecks className="size-6" />
                </div>
                <h2 className="mt-4 font-heading text-xl font-semibold group-hover:text-primary">
                  {g.title}
                </h2>
                {g.intro && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {g.intro}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {count} tools · Updated {formatDate(g.updatedAt)}
                  </span>
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}

          {/* Best-of article guides (same section, unified card) */}
          {bestOfPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ListChecks className="size-6" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-semibold group-hover:text-primary">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Guide · {formatDate(post.publishedAt)}</span>
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
