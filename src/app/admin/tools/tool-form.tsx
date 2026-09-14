"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface CategoryOption {
  slug: string;
  name: string;
}

export interface ToolFormValues {
  slug?: string;
  name?: string;
  logoUrl?: string | null;
  screenshotUrl?: string | null;
  shortDesc?: string;
  rating?: number;
  pricing?: string;
  editorialRank?: number | null;
  featured?: boolean;
  verified?: boolean;
  verdict?: string | null;
  reviewBody?: string | null;
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  pricingTiers?: unknown;
  faq?: unknown;
  affiliateSlug?: string | null;
  website?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  categorySlug?: string | null;
  tagSlugs?: string[];
}

const lines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const csv = (v: string) =>
  v
    .split(",")
    .map((s) => slugify(s.trim()))
    .filter(Boolean);

/** Full create/edit form for a Tool. Submits to POST /api/content. */
export function ToolForm({
  initial = {},
  categories,
  mode,
}: {
  initial?: ToolFormValues;
  categories: CategoryOption[];
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    // Parse optional JSON fields defensively.
    let pricingTiers: unknown = undefined;
    let faq: unknown = undefined;
    try {
      const pt = get("pricingTiers");
      if (pt) pricingTiers = JSON.parse(pt);
      const fq = get("faq");
      if (fq) faq = JSON.parse(fq);
    } catch {
      setError("Pricing tiers / FAQ must be valid JSON.");
      setBusy(false);
      return;
    }

    const name = get("name");
    const payload = {
      kind: "tool" as const,
      data: {
        slug: get("slug") || slugify(name),
        name,
        logoUrl: get("logoUrl") || null,
        screenshotUrl: get("screenshotUrl") || null,
        shortDesc: get("shortDesc"),
        rating: Number(get("rating")) || 0,
        pricing: get("pricing") || "FREEMIUM",
        editorialRank: get("editorialRank") ? Number(get("editorialRank")) : null,
        featured: fd.get("featured") === "on",
        verified: fd.get("verified") === "on",
        verdict: get("verdict") || null,
        reviewBody: get("reviewBody") || null,
        pros: lines(get("pros")),
        cons: lines(get("cons")),
        useCases: lines(get("useCases")),
        pricingTiers,
        faq,
        affiliateSlug: get("affiliateSlug") ? slugify(get("affiliateSlug")) : null,
        website: get("website") || null,
        metaTitle: get("metaTitle") || null,
        metaDescription: get("metaDescription") || null,
        categorySlug: get("categorySlug") || null,
        tagSlugs: csv(get("tagSlugs")),
      },
    };

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        issues?: unknown;
        slug?: string;
      };
      if (!res.ok) {
        throw new Error(body.error || "Save failed. Check the fields and try again.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Basics */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Legend>Basics</Legend>
        <Field label="Name *">
          <input name="name" required defaultValue={initial.name ?? ""} className={inputCls} />
        </Field>
        <Field label="Slug" hint="Auto-generated from name if left blank">
          <input name="slug" defaultValue={initial.slug ?? ""} className={inputCls} />
        </Field>
        <Field label="Short description *" className="sm:col-span-2">
          <input
            name="shortDesc"
            required
            maxLength={280}
            defaultValue={initial.shortDesc ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="Category">
          <select name="categorySlug" defaultValue={initial.categorySlug ?? ""} className={inputCls}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags" hint="Comma-separated, e.g. writing, seo">
          <input
            name="tagSlugs"
            defaultValue={(initial.tagSlugs ?? []).join(", ")}
            className={inputCls}
          />
        </Field>
      </fieldset>

      {/* Scoring */}
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <Legend>Scoring &amp; flags</Legend>
        <Field label="Rating (0–5)">
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={initial.rating ?? 0}
            className={inputCls}
          />
        </Field>
        <Field label="Pricing">
          <select name="pricing" defaultValue={initial.pricing ?? "FREEMIUM"} className={inputCls}>
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </Field>
        <Field label="Editorial rank" hint="Lower = higher">
          <input
            name="editorialRank"
            type="number"
            min="1"
            defaultValue={initial.editorialRank ?? ""}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="size-4" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="verified" defaultChecked={initial.verified} className="size-4" />
          Tested / Verified
        </label>
      </fieldset>

      {/* Links */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Legend>Links &amp; media</Legend>
        <Field label="Affiliate slug" hint="Links here route via /go/<slug>">
          <input name="affiliateSlug" defaultValue={initial.affiliateSlug ?? ""} className={inputCls} />
        </Field>
        <Field label="Official website">
          <input name="website" type="url" defaultValue={initial.website ?? ""} className={inputCls} />
        </Field>
        <Field label="Logo URL">
          <input name="logoUrl" type="url" defaultValue={initial.logoUrl ?? ""} className={inputCls} />
        </Field>
        <Field label="Screenshot URL">
          <input
            name="screenshotUrl"
            type="url"
            defaultValue={initial.screenshotUrl ?? ""}
            className={inputCls}
          />
        </Field>
      </fieldset>

      {/* Review content */}
      <fieldset className="space-y-4">
        <Legend>Review content</Legend>
        <Field label="Quick verdict" hint="2–3 sentences shown at the top">
          <textarea name="verdict" rows={2} defaultValue={initial.verdict ?? ""} className={inputCls} />
        </Field>
        <Field label="Review body (Markdown)" hint="Use ## headings for the table of contents">
          <textarea
            name="reviewBody"
            rows={12}
            defaultValue={initial.reviewBody ?? ""}
            className={`${inputCls} font-mono text-xs`}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pros" hint="One per line">
            <textarea name="pros" rows={5} defaultValue={(initial.pros ?? []).join("\n")} className={inputCls} />
          </Field>
          <Field label="Cons" hint="One per line">
            <textarea name="cons" rows={5} defaultValue={(initial.cons ?? []).join("\n")} className={inputCls} />
          </Field>
          <Field label="Use cases" hint="One per line">
            <textarea
              name="useCases"
              rows={5}
              defaultValue={(initial.useCases ?? []).join("\n")}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pricing tiers (JSON)" hint='[{"name":"Pro","price":"$20/mo","features":["…"]}]'>
            <textarea
              name="pricingTiers"
              rows={4}
              defaultValue={initial.pricingTiers ? JSON.stringify(initial.pricingTiers, null, 2) : ""}
              className={`${inputCls} font-mono text-xs`}
            />
          </Field>
          <Field label="FAQ (JSON)" hint='[{"q":"…","a":"…"}]'>
            <textarea
              name="faq"
              rows={4}
              defaultValue={initial.faq ? JSON.stringify(initial.faq, null, 2) : ""}
              className={`${inputCls} font-mono text-xs`}
            />
          </Field>
        </div>
      </fieldset>

      {/* SEO */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Legend>SEO overrides</Legend>
        <Field label="Meta title">
          <input name="metaTitle" defaultValue={initial.metaTitle ?? ""} className={inputCls} />
        </Field>
        <Field label="Meta description">
          <input name="metaDescription" defaultValue={initial.metaDescription ?? ""} className={inputCls} />
        </Field>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Create tool" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="col-span-full mb-1 font-heading text-base font-semibold">{children}</legend>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
