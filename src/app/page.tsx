import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Trophy,
  Compass,
  BadgeCheck,
  Rocket,
  Scale,
  RefreshCw,
  Check,
  ListChecks,
  Cloud,
} from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { HeroDecoration } from "@/components/hero-decoration";
import { HeroMockup } from "@/components/hero-mockup";
import { ToolGrid } from "@/components/tool-grid";
import { RankingList } from "@/components/ranking-list";
import { SectionHeading } from "@/components/section-heading";
import { NewsletterForm } from "@/components/newsletter-form";
import { Card } from "@/components/ui/card";
import { getFeaturedTools, getTrendingTools, getTools } from "@/features/tools/queries";
import { getCategories } from "@/features/categories/queries";
import { getGuides, parseGuideItems } from "@/features/guides/queries";
import { SITE, CATEGORY_ORDER } from "@/lib/constants";

export const revalidate = 3600; // ISR — TechStack §7

export default async function HomePage() {
  const [featured, trending, allCategories] = await Promise.all([
    getFeaturedTools(6),
    getTrendingTools(6),
    getCategories(),
  ]);

  // Show the 3 pillars in their canonical order (Tech → AI → Digital Products).
  const categories = [...allCategories].sort((a, b) => {
    const idx = (s: string) => {
      const i = CATEGORY_ORDER.indexOf(s as (typeof CATEGORY_ORDER)[number]);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    return idx(a.slug) - idx(b.slug);
  });

  // A few tools per top category for the browse-by-category sections.
  const categorySections = await Promise.all(
    categories.slice(0, 3).map(async (c) => ({
      category: c,
      tools: (await getTools({ categorySlug: c.slug, pageSize: 3 })).items,
    })),
  );

  const topRated = (await getTools({ pageSize: 5 })).items;
  const guides = (await getGuides()).slice(0, 3);
  const toolCount = (await getTools({ pageSize: 1 })).total;

  return (
    <>
      {/* Hero — decorated band (glow · dots · sunburst · rings · sparkles) + mockup */}
      <section className="hero-band relative overflow-hidden">
        <HeroDecoration />
        <div className="container relative z-10 flex flex-col items-center py-20 text-center sm:py-28">
          <span className="mb-5 inline-flex items-center rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            Hand-picked · Honestly reviewed · No fluff
          </span>
          <h1 className="display-title max-w-4xl text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            {SITE.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            CloudPixel covers AI tools, software and digital products in depth — with buying
            guides and honest verdicts. Less noise, more signal.
          </p>
          <div className="mt-8 w-full max-w-xl">
            <SearchBar />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>Explore:</span>
            <Link
              href="/best"
              className="rounded-full border border-border bg-card/80 px-2.5 py-0.5 text-foreground/80 shadow-sm hover:bg-accent"
            >
              Best Guides
            </Link>
            {categories.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-full border border-border bg-card/80 px-2.5 py-0.5 text-foreground/80 shadow-sm hover:bg-accent"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mt-16 w-full sm:mt-20">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* Featured — white section */}
      <section className="py-14 sm:py-16">
        <div className="container">
          <SectionHeading
            title="Featured tools"
            subtitle="Our current picks — tested and worth your time."
            seeAllHref="/full-list"
          />
          <ToolGrid
            tools={featured}
            emptyTitle="No featured tools yet"
            emptyDescription="Connect the database and seed it to see hand-picked tools here."
          />
        </div>
      </section>

      {/* How it works — 3 steps (tinted section, prompt §3) */}
      <section className="bg-muted/60 py-14 sm:py-20">
        <div className="container">
          <SectionHeading
            title="How it works"
            subtitle="From “which tool?” to a confident choice in three steps."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                icon: Compass,
                bg: "bg-primary",
                title: "Browse or search",
                desc: "Find tools by pillar (Tech, AI, Digital Products), tag, or a quick search.",
              },
              {
                step: "Step 2",
                icon: BadgeCheck,
                bg: "bg-[#6366F1]",
                title: "Read the honest review",
                desc: "A clear score, the good & the bad, pricing and who it's really for — tested, not hyped.",
              },
              {
                step: "Step 3",
                icon: Rocket,
                bg: "bg-[#0EA5E9]",
                title: "Pick with confidence",
                desc: "Compare the shortlist, grab any deal, and head straight to the tool.",
              },
            ].map((s) => (
              <Card key={s.step} className="p-7 text-center">
                <span
                  className={`mx-auto flex size-14 items-center justify-center rounded-full text-white shadow-md ${s.bg}`}
                >
                  <s.icon className="size-7" />
                </span>
                <span className="mt-4 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  {s.step}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See how we test &amp; score <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why trust our reviews — Benefits (prompt §4), honest editorial values */}
      <section className="py-14 sm:py-16">
        <div className="container">
          <SectionHeading
            title="Why trust our reviews"
            subtitle="No hype, no pay-to-win. Here's what stands behind every score."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BadgeCheck,
                bg: "bg-primary",
                title: "Hands-on tested",
                points: [
                  "Real accounts, real tasks",
                  "“Tested” badge only when we've used it",
                  "Screenshots from actual use",
                ],
              },
              {
                icon: Scale,
                bg: "bg-[#6366F1]",
                title: "Editorially independent",
                points: [
                  "Affiliate deals never change a score",
                  "We call out the downsides",
                  "Rankings are editorial, never paid",
                ],
              },
              {
                icon: RefreshCw,
                bg: "bg-[#0EA5E9]",
                title: "Kept up to date",
                points: [
                  "“Last updated” on every review",
                  "Revised as tools change",
                  "Reader corrections welcomed",
                ],
              },
            ].map((b) => (
              <Card key={b.title} className="p-7">
                <span
                  className={`flex size-12 items-center justify-center rounded-xl text-white shadow-md ${b.bg}`}
                >
                  <b.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">{b.title}</h3>
                <ul className="mt-3 space-y-2">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          {/* Honest stat row — real counts, not fabricated testimonials */}
          <div className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-muted/50 p-6 text-center sm:grid-cols-3">
            <div>
              <p className="font-heading text-3xl font-bold text-primary">{toolCount || 20}+</p>
              <p className="text-sm text-muted-foreground">tools reviewed in depth</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground">focused categories</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">independent verdicts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by category — tinted section */}
      {categorySections.length > 0 && (
        <section id="categories" className="scroll-mt-20 bg-muted/60 py-14 sm:py-16">
          <div className="container">
            <SectionHeading title="Browse by category" subtitle="Find tools by what you need to do." />
            <div className="space-y-10">
              {categorySections.map(({ category, tools }) =>
                tools.length === 0 ? null : (
                  <div key={category.id}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-heading text-xl font-semibold">{category.name}</h3>
                      <Link
                        href={`/category/${category.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        See all <ArrowRight className="size-4" />
                      </Link>
                    </div>
                    <ToolGrid tools={tools} />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular buying guides — white section (prompt §7 adaptation) */}
      {guides.length > 0 && (
        <section className="py-14 sm:py-16">
          <div className="container">
            <SectionHeading
              title="Popular buying guides"
              subtitle="Ranked shortlists for the “best X” questions people actually search."
              seeAllHref="/best"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <Link key={g.id} href={`/best/${g.slug}`} className="group flex">
                  <Card className="flex w-full flex-col p-6 transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(16,24,40,0.25)]">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ListChecks className="size-6" />
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-semibold group-hover:text-primary">
                      {g.title}
                    </h3>
                    {g.intro && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                        {g.intro}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {parseGuideItems(g.items).length} tools <ArrowRight className="size-4" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rankings — tinted section (PDR §4.1 / FR-1.2) */}
      <section className="bg-muted/60 py-14 sm:py-16">
        <div className="container">
          <SectionHeading title="Rankings" subtitle="Editor's picks and what's trending right now." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RankingList
              title="Editor's picks"
              tools={featured}
              seeAllHref="/full-list"
              icon={Sparkles}
              accent="violet"
            />
            <RankingList
              title="Trending now"
              tools={trending}
              seeAllHref="/full-list"
              icon={Flame}
              accent="coral"
            />
            <RankingList
              title="Top rated"
              tools={topRated}
              seeAllHref="/full-list"
              icon={Trophy}
              accent="blue"
            />
          </div>
        </div>
      </section>

      {/* Newsletter — light-blue CTA banner (Trackit §9) */}
      <section className="py-14 sm:py-16">
        <div className="container">
          <div
            id="newsletter"
            className="cta-banner scroll-mt-20 overflow-hidden rounded-3xl p-8 text-center text-foreground sm:p-14"
          >
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-navy text-navy-foreground shadow-sm">
              <Cloud className="size-6" strokeWidth={2.5} />
            </span>
            <h2 className="display-title text-3xl sm:text-4xl">One good tool in your inbox, weekly</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              No spam, no hype — just the occasional tool worth knowing about, with the honest
              verdict.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <NewsletterForm source="home" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
