import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Server-rendered pagination that preserves existing query params. */
export function Pagination({
  page,
  total,
  pageSize,
  baseHref,
  searchParams = {},
}: {
  page: number;
  total: number;
  pageSize: number;
  baseHref: string;
  searchParams?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <PageLink href={hrefFor(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </PageLink>
      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const gap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-input hover:bg-accent",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      <PageLink href={hrefFor(page + 1)} disabled={page >= totalPages} aria-label="Next page">
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
  ...rest
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  if (disabled) {
    return (
      <span
        className="inline-flex size-9 cursor-not-allowed items-center justify-center rounded-md border border-input text-muted-foreground/40"
        {...rest}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex size-9 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent"
      {...rest}
    >
      {children}
    </Link>
  );
}
