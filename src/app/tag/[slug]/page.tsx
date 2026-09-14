import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTagBySlug, getTagSlugs } from "@/features/tags/queries";
import { getTools } from "@/features/tools/queries";
import { ToolGrid } from "@/components/tool-grid";
import { Pagination } from "@/components/pagination";
import { buildMetadata } from "@/lib/seo";
import { PAGE_SIZE } from "@/lib/constants";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getTagSlugs()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug);
  if (!tag) return buildMetadata({ title: "Tag not found", noIndex: true });
  return buildMetadata({
    title: `${tag.name} tools`,
    description: `Tools tagged “${tag.name}” — hand-picked and reviewed.`,
    path: `/tag/${tag.slug}`,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const tag = await getTagBySlug(params.slug);
  if (!tag) notFound();

  const page = Number(searchParams.page) || 1;
  const { items, total } = await getTools({ tagSlug: tag.slug, page });

  return (
    <div className="container py-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Tag</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">#{tag.name}</h1>
      </header>

      <ToolGrid tools={items} emptyTitle={`No tools tagged “${tag.name}” yet`} />

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        baseHref={`/tag/${tag.slug}`}
        searchParams={searchParams}
      />
    </div>
  );
}
