import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { prisma, safeQuery } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { RatingBadge } from "@/components/rating-badge";
import { logout, deleteTool } from "./actions";
import { AffiliateLinkManager } from "./affiliate-manager";

export const metadata: Metadata = buildMetadata({ title: "Admin", noIndex: true });
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tools, links] = await Promise.all([
    safeQuery(
      () =>
        prisma.tool.findMany({
          orderBy: { updatedAt: "desc" },
          include: { category: true },
        }),
      [],
    ),
    safeQuery(() => prisma.affiliateLink.findMany({ orderBy: { updatedAt: "desc" } }), []),
  ]);

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Manage tools, reviews and affiliate links.</p>
        </div>
        <form action={logout}>
          <button className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent">
            Sign out
          </button>
        </form>
      </div>

      {/* Tools */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Tools ({tools.length})</h2>
          <Link
            href="/admin/tools/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> New tool
          </Link>
        </div>

        {tools.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No tools yet. Create one, or run <code>npm run db:seed</code> to load the starter set.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tools.map((t) => (
                  <tr key={t.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <RatingBadge rating={t.rating} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {[t.featured && "Featured", t.verified && "Tested"]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(t.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/tools/${t.slug}`}
                          target="_blank"
                          className="rounded p-2 hover:bg-accent"
                          title="View"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                        <Link
                          href={`/admin/tools/${t.slug}/edit`}
                          className="rounded p-2 hover:bg-accent"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <form action={deleteTool}>
                          <input type="hidden" name="slug" value={t.slug} />
                          <button
                            className="rounded p-2 text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Affiliate links */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold">Affiliate links ({links.length})</h2>
        <AffiliateLinkManager links={links} />
      </section>
    </div>
  );
}
