import Link from "next/link";
import { getCategories } from "@/features/categories/queries";
import { Logo } from "@/components/logo";
import { SITE, FOOTER_LINKS, CATEGORY_ORDER } from "@/lib/constants";

const orderIndex = (slug: string) => {
  const i = CATEGORY_ORDER.indexOf(slug as (typeof CATEGORY_ORDER)[number]);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

export async function Footer() {
  const categories = (await getCategories()).sort(
    (a, b) => orderIndex(a.slug) - orderIndex(b.slug),
  );

  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{SITE.tagline}.</p>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/full-list" className="hover:text-foreground">
                Full List
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-foreground">
                Search
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Cloudlee Review
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">Categories</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.length > 0 ? (
              categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="hover:text-foreground">
                    {c.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground/60">Coming soon</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">Site</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All reviews are independent opinions.
          </p>
          <p>
            <Link href="/affiliate-disclosure" className="hover:text-foreground">
              Some links are affiliate links.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
