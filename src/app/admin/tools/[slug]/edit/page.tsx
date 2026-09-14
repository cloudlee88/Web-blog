import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug } from "@/features/tools/queries";
import { getCategories } from "@/features/categories/queries";
import { buildMetadata } from "@/lib/seo";
import { ToolForm, type ToolFormValues } from "../../tool-form";

export const metadata: Metadata = buildMetadata({ title: "Edit tool", noIndex: true });
export const dynamic = "force-dynamic";

export default async function EditToolPage({ params }: { params: { slug: string } }) {
  const [tool, categories] = await Promise.all([getToolBySlug(params.slug), getCategories()]);
  if (!tool) notFound();

  const initial: ToolFormValues = {
    slug: tool.slug,
    name: tool.name,
    logoUrl: tool.logoUrl,
    screenshotUrl: tool.screenshotUrl,
    shortDesc: tool.shortDesc,
    rating: tool.rating,
    pricing: tool.pricing,
    editorialRank: tool.editorialRank,
    featured: tool.featured,
    verified: tool.verified,
    verdict: tool.verdict,
    reviewBody: tool.reviewBody,
    pros: tool.pros,
    cons: tool.cons,
    useCases: tool.useCases,
    pricingTiers: tool.pricingTiers,
    faq: tool.faq,
    affiliateSlug: tool.affiliateSlug,
    website: tool.website,
    metaTitle: tool.metaTitle,
    metaDescription: tool.metaDescription,
    categorySlug: tool.category?.slug ?? null,
    tagSlugs: tool.tags.map((t) => t.slug),
  };

  return (
    <div className="container max-w-4xl py-10">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mb-6 mt-4 font-heading text-3xl font-bold tracking-tight">
        Edit: {tool.name}
      </h1>
      <ToolForm
        mode="edit"
        initial={initial}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
