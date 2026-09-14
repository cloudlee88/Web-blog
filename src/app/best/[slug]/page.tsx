import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  getGuideBySlug,
  getGuideSlugs,
  parseGuideItems,
  resolveGuideItems,
} from "@/features/guides/queries";
import { MarkdownContent } from "@/components/markdown-content";
import { ToolLogo } from "@/components/tool-logo";
import { RatingBadge } from "@/components/rating-badge";
import { RankBadge, VerifiedBadge, PricingBadge } from "@/components/tool-badges";
import { AffiliateCTA } from "@/components/cta-button";
import { ShareButton } from "@/components/share-button";
import { EmptyState } from "@/components/empty-state";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getGuideSlugs()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug);
  if (!guide) return buildMetadata({ title: "Guide not found", noIndex: true });
  return buildMetadata({
    title: guide.metaTitle || guide.title,
    description: guide.metaDescription || guide.intro?.slice(0, 160) || undefined,
    path: `/best/${guide.slug}`,
    type: "article",
  });
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const guide = await getGuideBySlug(params.slug);
  if (!guide) notFound();

  const items = await resolveGuideItems(parseGuideItems(guide.items));
  const resolved = items.filter((i) => i.tool);

  // JSON-LD ItemList for the ranked guide (rich results).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.title,
    itemListElement: resolved.map((i) => ({
      "@type": "ListItem",
      position: i.rank,
      name: i.tool!.name,
      url: new URL(`/tools/${i.tool!.slug}`, SITE.url).toString(),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container max-w-4xl py-8 lg:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/best" className="hover:text-foreground">
            Best Guides
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{guide.title}</span>
        </nav>

        <header>
          <h1 className="display-title text-4xl sm:text-5xl">{guide.title}</h1>
          <div className="mt-4">
            <ShareButton path={`/best/${guide.slug}`} title={guide.title} />
          </div>
        </header>

        {guide.intro && (
          <div className="mt-6">
            <MarkdownContent content={guide.intro} />
          </div>
        )}

        {resolved.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No tools in this guide yet"
              description="The tools referenced by this guide haven't been imported yet."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {resolved.map(({ tool, rank, miniVerdict, score }) => (
              <div
                key={tool!.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <RankBadge rank={rank} />
                  <ToolLogo name={tool!.name} logoUrl={tool!.logoUrl} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/tools/${tool!.slug}`}
                        className="font-heading text-xl font-semibold hover:text-primary"
                      >
                        {tool!.name}
                      </Link>
                      {tool!.verified && <VerifiedBadge />}
                      <RatingBadge rating={score ?? tool!.rating} />
                      <PricingBadge pricing={tool!.pricing} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">{miniVerdict}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <AffiliateCTA
                    affiliateSlug={tool!.affiliateSlug}
                    website={tool!.website}
                    toolName={tool!.name}
                  />
                  <Link
                    href={`/tools/${tool!.slug}`}
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-input px-5 text-sm font-medium hover:bg-accent"
                  >
                    Read full review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
