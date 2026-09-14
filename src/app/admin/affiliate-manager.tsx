import type { AffiliateLink } from "@prisma/client";
import { Trash2, Save } from "lucide-react";
import { upsertAffiliateLink, deleteAffiliateLink } from "./actions";

/** Manage cloaked affiliate links (the /go/[slug] targets). Server component. */
export function AffiliateLinkManager({ links }: { links: AffiliateLink[] }) {
  return (
    <div className="space-y-6">
      {/* Create / update form */}
      <form
        action={upsertAffiliateLink}
        className="grid gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
      >
        <label className="text-sm">
          <span className="mb-1 block font-medium">Slug *</span>
          <input
            name="slug"
            required
            placeholder="e.g. jasper"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
          <span className="mt-1 block text-xs text-muted-foreground">Used as /go/&lt;slug&gt;</span>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Target URL *</span>
          <input
            name="targetUrl"
            type="url"
            required
            placeholder="https://partner.example.com/aff?id=123"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Network</span>
          <input
            name="network"
            placeholder="Impact / PartnerStack / direct"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Coupon code</span>
          <input
            name="couponCode"
            placeholder="Optional"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="size-4" />
          Active
        </label>
        <div className="flex items-end justify-end">
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Save className="size-4" /> Save link
          </button>
        </div>
      </form>

      {/* Existing links */}
      {links.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Coupon</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((l) => (
                <tr key={l.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono">{l.slug}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {l.targetUrl}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{l.couponCode ?? "—"}</td>
                  <td className="px-4 py-3">{l.active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteAffiliateLink} className="inline">
                      <input type="hidden" name="slug" value={l.slug} />
                      <button
                        className="rounded p-2 text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
