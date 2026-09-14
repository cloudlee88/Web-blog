/**
 * Bootstrap seed (Implementation Plan Task 1.4).
 * Loads the category taxonomy, affiliate links, posts and buying guides.
 * Idempotent — safe to re-run.
 *
 * Tool reviews are loaded separately via the content-import pipeline:
 *   npm run db:seed   # this file — categories, affiliate links, posts, guides
 *   npm run import    # content-import/tools/*.md — the tool reviews
 */
import { PrismaClient, Prisma, type PostType } from "@prisma/client";
import { CATEGORIES } from "../content-import/categories";
import { POSTS } from "../content-import/posts";
import { GUIDES } from "../content-import/guides";

const prisma = new PrismaClient();

const affiliateLinks = [
  { slug: "jasper", targetUrl: "https://jasper.ai/?ref=cloudpixel", network: "PartnerStack", couponCode: "JASPER20" },
  { slug: "grammarly", targetUrl: "https://grammarly.com/?ref=cloudpixel", network: "Impact", couponCode: null },
  { slug: "notion", targetUrl: "https://notion.so/?ref=cloudpixel", network: "direct", couponCode: null },
  { slug: "canva", targetUrl: "https://canva.com/?ref=cloudpixel", network: "Impact", couponCode: null },
  { slug: "elevenlabs", targetUrl: "https://elevenlabs.io/?ref=cloudpixel", network: "direct", couponCode: "CORNER10" },
  { slug: "surfer", targetUrl: "https://surferseo.com/?ref=cloudpixel", network: "PartnerStack", couponCode: null },
  { slug: "delonghi-magnifica-s", targetUrl: "https://amazon.com/dp/B07RQ3NM4F?tag=cloudpixel-20", network: "Amazon", couponCode: null },
  { slug: "charlotte-tilbury-pillow-talk", targetUrl: "https://charlottetilbury.com/pillow-talk-set?ref=cloudpixel", network: "Rakuten", couponCode: null },
  { slug: "netflix", targetUrl: "https://netflix.com/?ref=cloudpixel", network: "Impact", couponCode: null },
  { slug: "roma-pro-coffee-roaster", targetUrl: "https://www.magomaga.com/", network: "direct", couponCode: null },
  { slug: "powercure-pro", targetUrl: "https://www.powercure.com/", network: "direct", couponCode: null },
  { slug: "livwell-diamondclad-cookware", targetUrl: "https://www.livwellhq.com/", network: "direct", couponCode: null },
];

async function main() {
  console.log("🌱 Seeding CloudPixel (categories, affiliate links, posts, guides)…");

  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, create: c, update: c });
  }
  console.log(`  ✓ ${CATEGORIES.length} categories`);

  for (const link of affiliateLinks) {
    await prisma.affiliateLink.upsert({
      where: { slug: link.slug },
      create: { ...link, active: true },
      update: { ...link, active: true },
    });
  }
  console.log(`  ✓ ${affiliateLinks.length} affiliate links`);

  for (const p of POSTS) {
    const data = {
      slug: p.slug,
      title: p.title,
      type: p.type as PostType,
      topic: p.topic ?? null,
      categorySlug: p.categorySlug ?? null,
      excerpt: p.excerpt,
      body: p.body,
      publishedAt: new Date(p.publishedAt),
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
    };
    await prisma.post.upsert({ where: { slug: p.slug }, create: data, update: data });
  }
  console.log(`  ✓ ${POSTS.length} posts`);

  for (const g of GUIDES) {
    const data = { ...g, items: g.items as unknown as Prisma.InputJsonValue };
    await prisma.guide.upsert({ where: { slug: g.slug }, create: data, update: data });
  }
  console.log(`  ✓ ${GUIDES.length} buying guides`);

  console.log("✅ Bootstrap seed complete. Now run `npm run import` to load tool reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
