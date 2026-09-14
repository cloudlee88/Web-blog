import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/features/categories/queries";
import { buildMetadata } from "@/lib/seo";
import { ToolForm } from "../tool-form";

export const metadata: Metadata = buildMetadata({ title: "New tool", noIndex: true });
export const dynamic = "force-dynamic";

export default async function NewToolPage() {
  const categories = await getCategories();
  return (
    <div className="container max-w-4xl py-10">
      <Link href="/admin" className="text-sm font-medium text-primary hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mb-6 mt-4 font-heading text-3xl font-bold tracking-tight">New tool</h1>
      <ToolForm mode="create" categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  );
}
