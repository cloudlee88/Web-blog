import Link from "next/link";

/** Consistent section title with an optional "See all" link. */
export function SectionHeading({
  title,
  subtitle,
  seeAllHref,
  id,
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-6 flex items-end justify-between gap-4 scroll-mt-20">
      <div>
        <h2 className="display-title text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          See all →
        </Link>
      )}
    </div>
  );
}
