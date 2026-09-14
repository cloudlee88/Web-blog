"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Search input that navigates to /search?q=… on submit. */
export function SearchBar({
  defaultValue = "",
  autoFocus = false,
  placeholder = "Search AI tools, e.g. “image generator”…",
  className,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label="Search"
        className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-28 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        className="cta-gradient absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-5 py-2.5 text-sm font-semibold text-navy-foreground"
      >
        Search
      </button>
    </form>
  );
}
