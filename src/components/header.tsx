"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav — clean, evenly spaced (Trackit) */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/#newsletter"
            className="cta-gradient hidden rounded-lg px-4 py-2 text-sm font-semibold text-navy-foreground shadow-sm sm:inline-flex"
          >
            Subscribe
          </Link>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("border-t border-border md:hidden", open ? "block" : "hidden")}>
        <nav className="container flex flex-col py-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#newsletter"
            onClick={() => setOpen(false)}
            className="cta-gradient mt-1 rounded-lg px-3 py-3 text-center text-sm font-semibold text-navy-foreground"
          >
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
