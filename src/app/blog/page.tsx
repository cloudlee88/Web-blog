import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { PostType } from "@prisma/client";
import { getPosts } from "@/features/posts/queries";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { buildMetadata } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";
import { PAGE_SIZE, BLOG_TOPICS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const TABS: { value: string; label: string; type?: PostType }[] = [
  { value: "", label: "All" },
  { value: "tutorial", label: "Tutorials", type: "TUTORIAL" },
  { value: "news", label: "News", type: "NEWS" },
  { value: "blog", label: "Blog", type: "BLOG" },
  { value: "review", label: "Reviews", type: "REVIEW" },
];

export const metadata: Metadata = buildMetadata({
  title: "Cloudlee Review",
  description:
    "Cloudlee Review — guides, tutorials, honest takes and product reviews from the CloudPixel team.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { type?: string; topic?: string; page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const activeTab = TABS.find((t) => t.value === searchParams.type) ?? TABS[0]!;
  const activeTopic = searchParams.topic || "";
  const isReviewTab = activeTab.value === "review";

  const { items, total } = await getPosts({
    type: activeTab.type,
    topic: isReviewTab && activeTopic ? activeTopic : undefined,
    // The blog holds comparisons, tutorials & product reviews. Best-of
    // listicles live under Best Guides (categorySlug "buying-guides"), so
    // only surface uncategorized posts here.
    categorySlug: null,
    page,
  });

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="display-title text-4xl sm:text-5xl">Cloudlee Review</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Guides, tutorials, honest takes and product reviews from the CloudPixel team.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/blog?type=${t.value}` : "/blog"}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab.value === t.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-accent",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {isReviewTab && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog?type=review"
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              !activeTopic
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-accent",
            )}
          >
            All topics
          </Link>
          {BLOG_TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={`/blog?type=review&topic=${t.slug}`}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeTopic === t.slug
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-input text-muted-foreground hover:bg-accent",
              )}
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="We're writing our first guides. Subscribe to get them first."
          action={{ href: "/#newsletter", label: "Get notified" }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              {post.coverUrl && (
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    width={640}
                    height={360}
                    className="size-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">
                    {post.type.toLowerCase()}
                  </span>
                  {post.topic && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {BLOG_TOPICS.find((t) => t.slug === post.topic)?.name ?? post.topic}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 font-heading text-lg font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)} · {readingTime(post.body)} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        baseHref="/blog"
        searchParams={searchParams}
      />
    </div>
  );
}
