"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PRICING_OPTIONS = [
  { value: "", label: "All prices" },
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Paid" },
];

/**
 * URL-driven filters for the directory (FR-1.5). Updates query params and lets
 * the server component re-query. Keeps state shareable / bookmarkable.
 */
export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("pricing") ?? "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // reset pagination when filters change
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Pricing:</span>
      {PRICING_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setParam("pricing", opt.value)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            current === opt.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input hover:bg-accent",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
