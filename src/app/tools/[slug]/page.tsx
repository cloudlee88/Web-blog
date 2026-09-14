import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, CalendarClock } from "lucide-react";
import {
  getToolBySlug,
  getSimilarTools,
  getAllToolSlugs,
} from "@/features/tools/queries";
import { getAffiliateLink } from "@/features/affiliate/queries";
import { ToolLogo } from "@/components/tool-logo";
import { RatingBadge } from "@/components/rating-badge";
import { VerifiedBadge, PricingBadge } from "@/components/tool-badges";
import { AffiliateCTA } from "@/components/cta-button";
import { VerdictBox } from "@/components/verdict-box";
import { ShareButton } from "@/components/share-button";
import { PricingTable, parsePricingTiers } from "@/components/pricing-table";
import { FaqAccordion, parseFaq } from "@/components/faq-accordion";
import { TableOfContents } from "@/components/table-of-contents";
import { MarkdownContent } from "@/components/markdown-content";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { extractHeadings } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { buildMetadata, reviewJsonLd, faqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const tools = await getAllToolSlugs();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({
    title: tool.metaTitle || `${tool.name} Review`,
    description: tool.metaDescription || tool.shortDesc,
    path: `/tools/${tool.slug}`,
    image: tool.screenshotUrl || tool.logoUrl || SITE.ogImage,
    type: "article",
  });
}

export default async function ToolReviewPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  const [similar, affiliate] = await Promise.all([
    getSimilarTools(tool, 4),
    tool.affiliateSlug ? getAffiliateLink(tool.affiliateSlug) : Promise.resolve(null),
  ]);

  const headings = extractHeadings(tool.reviewBody);
  const pricingTiers = parsePricingTiers(tool.pricingTiers);
  const faq = parseFaq(tool.faq);
  const coupon = affiliate?.active ? affiliate.couponCode : null;

  const jsonLd = [reviewJsonLd(tool), ...(faq.length ? [faqJsonLd(faq)] : [])];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          {tool.category ? (
            <>
              <Link href={`/category/${tool.category.slug}`} className="hover:text-foreground">
                {tool.category.name}
              </Link>
              <ChevronRight className="size-3.5" />
            </>
          ) : null}
          <span className="text-foreground">{tool.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <ToolLogo name={tool.name} logoUrl={tool.logoUrl} size={72} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                    {tool.name}
                  </h1>
                  {tool.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{tool.shortDesc}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {tool.rating > 0 && <RatingBadge rating={tool.rating} size="lg" />}
                  {tool.editorialRank && (
                    <Badge variant="featured">Ranked #{tool.editorialRank}</Badge>
                  )}
                  <PricingBadge pricing={tool.pricing} />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5" />
                    Updated {formatDate(tool.updatedAt)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <ShareButton path={`/tools/${tool.slug}`} title={`${tool.name} review`} />
                  <Link
                    href="/methodology"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    How we review
                  </Link>
                </div>
              </div>
            </header>

            {/* Verdict box — scannable summary above the fold (v2.1 §3.2, FR-2.6) */}
            <VerdictBox
              name={tool.name}
              rating={tool.rating}
              verdict={tool.verdict}
              pros={tool.pros}
              cons={tool.cons}
              affiliateSlug={tool.affiliateSlug}
              website={tool.website}
              coupon={coupon}
            />

            {/* Mobile ToC */}
            {headings.length >= 3 && (
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 lg:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Screenshot */}
            {tool.screenshotUrl && (
              <figure className="mt-8">
                <Image
                  src={tool.screenshotUrl}
                  alt={`${tool.name} screenshot`}
                  width={1200}
                  height={720}
                  className="w-full rounded-xl border border-border"
                />
              </figure>
            )}

            {/* Long-form review */}
            {tool.reviewBody && (
              <section className="mt-10">
                <MarkdownContent content={tool.reviewBody} />
              </section>
            )}

            {/* Pricing */}
            {pricingTiers.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight">Pricing</h2>
                <PricingTable tiers={pricingTiers} />
              </section>
            )}

            {/* Use cases */}
            {tool.useCases.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight">
                  Who it&apos;s for
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tool.useCases.map((uc, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border bg-card p-4 text-sm text-foreground/90"
                    >
                      {uc}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight">FAQ</h2>
                <FaqAccordion items={faq} />
              </section>
            )}

            {/* Closing CTA */}
            <section className="mt-10 rounded-xl border border-primary/20 bg-accent/40 p-6 text-center">
              <h2 className="font-heading text-xl font-bold">Ready to try {tool.name}?</h2>
              <div className="mx-auto mt-4 max-w-sm">
                <AffiliateCTA
                  affiliateSlug={tool.affiliateSlug}
                  website={tool.website}
                  toolName={tool.name}
                  label={`Get ${tool.name}`}
                />
              </div>
            </section>

            {/* Similar tools */}
            {similar.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight">
                  Similar tools
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {similar.map((t) => (
                    <ToolCard key={t.id} tool={t} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {headings.length >= 3 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <TableOfContents headings={headings} />
                </div>
              )}
              <div className="rounded-xl border border-border bg-card p-4">
                <AffiliateCTA
                  affiliateSlug={tool.affiliateSlug}
                  website={tool.website}
                  toolName={tool.name}
                />
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
