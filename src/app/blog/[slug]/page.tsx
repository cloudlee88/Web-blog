import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPublishedPostSlugs } from "@/features/posts/queries";
import { MarkdownContent } from "@/components/markdown-content";
import { NewsletterForm } from "@/components/newsletter-form";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";
import { BLOG_TOPICS } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPublishedPostSlugs()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    path: `/blog/${post.slug}`,
    image: post.coverUrl || undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  // Only show published posts publicly.
  if (!post || !post.publishedAt || post.publishedAt > new Date()) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
      <article className="container max-w-3xl py-10">
        <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
          ← Back to Cloudlee Review
        </Link>

        <header className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-primary">
              {post.type.toLowerCase()}
            </span>
            {post.topic && (
              <Link
                href={`/blog?type=review&topic=${post.topic}`}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {BLOG_TOPICS.find((t) => t.slug === post.topic)?.name ?? post.topic}
              </Link>
            )}
          </div>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(post.publishedAt)} · {readingTime(post.body)} min read
          </p>
        </header>

        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={post.title}
            width={1200}
            height={630}
            className="mt-6 w-full rounded-xl border border-border"
            priority
          />
        )}

        <div className="mt-8">
          <MarkdownContent content={post.body} />
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-accent/40 p-8 text-center">
          <h2 className="font-heading text-xl font-bold">Enjoyed this?</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Get the next guide and tool review in your inbox.
          </p>
          <div className="mx-auto mt-4 max-w-md">
            <NewsletterForm source={`blog:${post.slug}`} />
          </div>
        </section>
      </article>
    </>
  );
}
