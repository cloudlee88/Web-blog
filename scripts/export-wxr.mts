/**
 * Export CloudPixel content to a WordPress WXR file that WP's native importer
 * (Tools → Import → WordPress) ingests directly — no plugin needed.
 * Includes: 30 tool reviews, 3 buying guides, 2 blog posts, and categories/tags.
 * Each post is self-contained HTML (verdict, good/bad, pricing, use-cases, FAQ,
 * CTA + disclosure) so it looks complete on any theme.
 *
 *   npx tsx scripts/export-wxr.mts   → wordpress-export/cloudpixel.xml
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { CATEGORIES } from "../content-import/categories";
import { POSTS } from "../content-import/posts";
import { GUIDES } from "../content-import/guides";
import { logoFor } from "../content-import/logo";
import { canonicalTagSlugs, tagDisplayName } from "../content-import/tags";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = join(HERE, "..", "content-import", "tools");
const OUT_DIR = join(HERE, "..", "wordpress-export");
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cloudpixel.com";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cdata = (s: string) => `<![CDATA[${String(s).replace(/]]>/g, "]]&gt;")}]]>`;
// Rewrite Next.js /tools/<slug> links to WordPress /<slug>/ permalinks.
const rewrite = (md: string) =>
  md.replace(/\/tools\/([a-z0-9-]+)/g, "/$1/");
const md2html = (md: string) => marked.parse(rewrite(md), { async: false }) as string;


const EXTRA_CATS = [
  { slug: "buying-guides", name: "Buying Guides", description: "Ranked shortlists — the best AI tool for each job." },
  { slug: "blog", name: "Cloudlee Review", description: "Guides, tutorials and honest takes from CloudPixel." },
  { slug: "lifestyle", name: "Lifestyle", description: "Product reviews — coffee, kitchen, home and everyday gear." },
  { slug: "beauty-fashion", name: "Beauty & Fashion", description: "Honest reviews of beauty products, skincare and fashion." },
  { slug: "entertainment", name: "Entertainment", description: "Streaming, gaming and entertainment reviews." },
];
const ALL_CATS = [...CATEGORIES, ...EXTRA_CATS];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
// Format in UTC so post_date_gmt is a real GMT value (not machine-local time).
function fmtDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:00`;
}

interface ItemInput {
  postId: number;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  categorySlug: string;
  tags?: string[];
  date: Date;
  meta?: Record<string, string | number | undefined>;
}

function makeItem(it: ItemInput): string {
  const catName = ALL_CATS.find((c) => c.slug === it.categorySlug)?.name ?? it.categorySlug;
  const cats = [
    `<category domain="category" nicename="${it.categorySlug}">${cdata(catName)}</category>`,
    ...(it.tags ?? []).map((t) => `<category domain="post_tag" nicename="${t}">${cdata(tagDisplayName(t))}</category>`),
  ].join("\n      ");
  const meta = Object.entries(it.meta ?? {})
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `      <wp:postmeta><wp:meta_key>${cdata(k)}</wp:meta_key><wp:meta_value>${cdata(String(v))}</wp:meta_value></wp:postmeta>`,
    )
    .join("\n");
  const date = fmtDate(it.date);
  return `    <item>
      <title>${cdata(it.title)}</title>
      <link>${SITE}/${it.slug}/</link>
      <pubDate>${it.date.toUTCString()}</pubDate>
      <dc:creator>${cdata("cloudpixel")}</dc:creator>
      <guid isPermaLink="false">cloudpixel-${it.slug}</guid>
      <description></description>
      <content:encoded>${cdata(it.html)}</content:encoded>
      <excerpt:encoded>${cdata(it.excerpt)}</excerpt:encoded>
      <wp:post_id>${it.postId}</wp:post_id>
      <wp:post_date>${cdata(date)}</wp:post_date>
      <wp:post_date_gmt>${cdata(date)}</wp:post_date_gmt>
      <wp:comment_status>${cdata("closed")}</wp:comment_status>
      <wp:ping_status>${cdata("closed")}</wp:ping_status>
      <wp:post_name>${cdata(it.slug)}</wp:post_name>
      <wp:status>${cdata("publish")}</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type>${cdata("post")}</wp:post_type>
      <wp:post_password>${cdata("")}</wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      ${cats}
${meta}
    </item>`;
}

function reviewHtml(d: Record<string, any>, body: string): string {
  const p: string[] = [];

  // Verdict box (score + verdict + The Good / The Bad columns + CTA) — styled by
  // the CloudPixel theme's .verdict-box CSS.
  const vb: string[] = ['<div class="verdict-box">', '<div class="vb-top">'];
  const logo = logoFor(d.logoUrl, d.website);
  if (logo)
    vb.push(`<div class="vb-logo"><img src="${esc(logo)}" alt="${esc(d.name)} logo" width="56" height="56" loading="lazy"></div>`);
  if (d.rating)
    vb.push(`<div class="vb-score"><span class="vb-num">${esc(String(d.rating))}</span><span class="vb-out">out of 5</span></div>`);
  const vbPrice = ({ FREE: "Free", FREEMIUM: "Freemium", PAID: "Paid" } as Record<string, string>)[
    String(d.pricing || "").toUpperCase()
  ];
  const vbBadges = [
    d.verified ? `<span class="vb-badge vb-tested">✓ Tested</span>` : "",
    vbPrice ? `<span class="vb-badge vb-price">${esc(vbPrice)}</span>` : "",
  ].join("");
  vb.push(
    `<div class="vb-verdict"><div class="vb-head"><span class="vb-name">${esc(d.name)}</span>${vbBadges}</div><span class="vb-label">Our verdict</span><p>${esc(d.verdict || `Our hands-on review of ${d.name}.`)}</p></div>`,
  );
  vb.push("</div>");
  if (d.pros?.length || d.cons?.length) {
    vb.push('<div class="vb-cols">');
    if (d.pros?.length)
      vb.push(`<div class="vb-good"><h4>The Good</h4><ul>${d.pros.map((x: string) => `<li>${esc(x)}</li>`).join("")}</ul></div>`);
    if (d.cons?.length)
      vb.push(`<div class="vb-bad"><h4>The Bad</h4><ul>${d.cons.map((x: string) => `<li>${esc(x)}</li>`).join("")}</ul></div>`);
    vb.push("</div>");
  }
  if (d.website)
    vb.push(`<div class="vb-cta"><a href="${esc(d.website)}" rel="nofollow sponsored noopener" target="_blank">Visit ${esc(d.name)}</a></div>`);
  vb.push("</div>");
  p.push(vb.join("\n"));

  if (d.screenshotUrl)
    p.push(`<figure class="review-shot"><img src="${esc(d.screenshotUrl)}" alt="${esc(d.name)} screenshot" loading="lazy"></figure>`);
  if (body) p.push(md2html(body));
  if (d.pricingTiers?.length) {
    const rows = d.pricingTiers
      .map((t: any) => `<li><strong>${esc(t.name)}</strong> — ${esc(t.price)}${t.features?.length ? `: ${t.features.map(esc).join(", ")}` : ""}</li>`)
      .join("\n");
    p.push(`<h2>Pricing</h2>\n<ul>\n${rows}\n</ul>`);
  }
  if (d.useCases?.length) p.push(`<h2>Who it's for</h2>\n<ul>\n${d.useCases.map((x: string) => `<li>${esc(x)}</li>`).join("\n")}\n</ul>`);
  if (d.faq?.length) p.push(`<h2>FAQ</h2>\n${d.faq.map((f: any) => `<h3>${esc(f.q)}</h3>\n<p>${esc(f.a)}</p>`).join("\n")}`);
  return p.join("\n\n");
}

function main() {
  const files = readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
  const usedTags = new Map<string, string>();
  const slugToName = new Map<string, string>();
  const toolMeta = new Map<
    string,
    { name: string; rating?: unknown; pricing?: string; website?: string; logo?: string | null; verified?: boolean }
  >();
  const items: string[] = [];
  // Anchor all generated dates to a FIXED point in the past (not export time) so
  // WordPress never treats an imported post as "scheduled/future" (which would
  // hide it from the site). Content already caps at 2026-07-11.
  const base = new Date("2026-07-11T08:00:00Z");

  // 1) Tool reviews
  files.forEach((file, i) => {
    const { data: d, content } = matter(readFileSync(join(TOOLS_DIR, file), "utf8"));
    const tags: string[] = canonicalTagSlugs(d.tags);
    tags.forEach((t) => usedTags.set(t, tagDisplayName(t)));
    slugToName.set(String(d.slug), String(d.name));
    toolMeta.set(String(d.slug), {
      name: String(d.name),
      rating: d.rating,
      pricing: d.pricing,
      website: d.website,
      logo: logoFor(d.logoUrl, d.website),
      verified: Boolean(d.verified),
    });
    items.push(
      makeItem({
        postId: 1000 + i,
        title: String(d.metaTitle || `${d.name} Review`),
        slug: String(d.slug),
        html: reviewHtml(d, content.trim()),
        excerpt: String(d.shortDesc || ""),
        categorySlug: String(d.categorySlug),
        tags,
        date: new Date(base.getTime() - i * 60000),
        meta: {
          cloudpixel_rating: d.rating,
          cloudpixel_pricing: d.pricing,
          cloudpixel_website: d.website,
          cloudpixel_logo_url: logoFor(d.logoUrl, d.website),
          cloudpixel_verified: d.verified ? "1" : "0",
          cloudpixel_featured: d.featured ? "1" : "",
          cloudpixel_editorial_rank: d.editorialRank,
        },
      }),
    );
  });

  // 2) Buying guides — rich ranked cards (logo · Tested · rating · pricing · CTAs),
  //    matching the Next.js /best/[slug] layout. Styled by the theme's .guide-pick CSS.
  const pricingLabel = (p?: string) =>
    ({ FREE: "Free", FREEMIUM: "Freemium", PAID: "Paid" } as Record<string, string>)[String(p || "").toUpperCase()] || "";
  GUIDES.forEach((g, i) => {
    const ranked = [...g.items].sort((a, b) => a.rank - b.rank);
    const cards = ranked
      .map((it) => {
        const m = toolMeta.get(it.toolSlug);
        const name = m?.name ?? slugToName.get(it.toolSlug) ?? it.toolSlug;
        const score = it.score ?? m?.rating;
        const price = pricingLabel(m?.pricing);
        const badges = [
          m?.verified ? `<span class="gp-badge gp-tested">✓ Tested</span>` : "",
          score ? `<span class="gp-badge gp-rating">★ ${esc(String(score))}</span>` : "",
          price ? `<span class="gp-badge gp-price">${esc(price)}</span>` : "",
        ].join("");
        const goto = m?.website
          ? `<a class="gp-cta" href="${esc(m.website)}" rel="nofollow sponsored noopener" target="_blank">Go to ${esc(name)} &#8599;</a>`
          : "";
        const logo = m?.logo
          ? `<img class="gp-logo" src="${esc(m.logo)}" alt="${esc(name)} logo" width="48" height="48" loading="lazy">`
          : "";
        return `<div class="guide-pick">
  <div class="gp-rank">#${it.rank}</div>
  ${logo}
  <div class="gp-body">
    <div class="gp-head"><span class="gp-name">${esc(name)}</span>${badges}</div>
    <p class="gp-verdict">${esc(it.miniVerdict)}</p>
    <div class="gp-actions">${goto}<a class="gp-review" href="/${it.toolSlug}/">Read full review</a></div>
  </div>
</div>`;
      })
      .join("\n");
    items.push(
      makeItem({
        postId: 2000 + i,
        title: g.metaTitle || g.title,
        slug: g.slug,
        html: `${md2html(g.intro)}\n\n<div class="guide-picks">\n${cards}\n</div>`,
        excerpt: g.metaDescription || "",
        categorySlug: "buying-guides",
        date: new Date(base.getTime() - (i + 1) * 3600000),
      }),
    );
  });

  // 3) Blog + review posts
  //    - Best-of listicles  → "buying-guides" (Best Guides).
  //    - Everything else (comparisons, tutorials, news, product reviews) → "blog"
  //      (Cloudlee Review). The post TYPE + review topic ride along as meta so the
  //      Cloudlee Review archive can render type tabs (Tutorials/News/Blog/Reviews)
  //      and a topic sub-filter, mirroring the local site.
  POSTS.forEach((post, i) => {
    const catSlug = post.categorySlug ?? "blog";
    const postLogo = post.website ? logoFor(undefined, post.website) : null;
    const meta: Record<string, string | undefined> = {
      cloudpixel_ptype: String(post.type || "BLOG").toLowerCase(),
    };
    if (post.topic) meta.cloudpixel_topic = post.topic;
    if (postLogo) meta.cloudpixel_logo_url = postLogo;
    items.push(
      makeItem({
        postId: 3000 + i,
        title: post.metaTitle || post.title,
        slug: post.slug,
        html: md2html(post.body),
        excerpt: post.excerpt,
        categorySlug: catSlug,
        date: new Date(post.publishedAt),
        meta,
      }),
    );
  });

  // 4) Affiliate links (custom post type: affiliate_link)
  const AFFILIATE_LINKS = [
    { slug: "jasper", targetUrl: "https://jasper.ai/?ref=cloudpixel", network: "PartnerStack" },
    { slug: "grammarly", targetUrl: "https://grammarly.com/?ref=cloudpixel", network: "Impact" },
    { slug: "notion", targetUrl: "https://notion.so/?ref=cloudpixel", network: "direct" },
    { slug: "canva", targetUrl: "https://canva.com/?ref=cloudpixel", network: "Impact" },
    { slug: "elevenlabs", targetUrl: "https://elevenlabs.io/?ref=cloudpixel", network: "direct" },
    { slug: "surfer", targetUrl: "https://surferseo.com/?ref=cloudpixel", network: "PartnerStack" },
    { slug: "delonghi-magnifica-s", targetUrl: "https://amazon.com/dp/B07RQ3NM4F?tag=cloudpixel-20", network: "Amazon" },
    { slug: "charlotte-tilbury-pillow-talk", targetUrl: "https://charlottetilbury.com/pillow-talk-set?ref=cloudpixel", network: "Rakuten" },
    { slug: "netflix", targetUrl: "https://netflix.com/?ref=cloudpixel", network: "Impact" },
    { slug: "roma-pro-coffee-roaster", targetUrl: "https://www.magomaga.com/", network: "direct" },
    { slug: "powercure-pro", targetUrl: "https://www.powercure.com/", network: "direct" },
    { slug: "livwell-diamondclad-cookware", targetUrl: "https://www.livwellhq.com/", network: "direct" },
  ];
  AFFILIATE_LINKS.forEach((link, i) => {
    const date = fmtDate(base);
    items.push(`    <item>
      <title>${cdata(link.slug)}</title>
      <link>${SITE}/go/${link.slug}/</link>
      <pubDate>${base.toUTCString()}</pubDate>
      <dc:creator>${cdata("cloudpixel")}</dc:creator>
      <guid isPermaLink="false">cloudpixel-aff-${link.slug}</guid>
      <description></description>
      <content:encoded>${cdata("")}</content:encoded>
      <excerpt:encoded>${cdata("")}</excerpt:encoded>
      <wp:post_id>${4000 + i}</wp:post_id>
      <wp:post_date>${cdata(date)}</wp:post_date>
      <wp:post_date_gmt>${cdata(date)}</wp:post_date_gmt>
      <wp:comment_status>${cdata("closed")}</wp:comment_status>
      <wp:ping_status>${cdata("closed")}</wp:ping_status>
      <wp:post_name>${cdata(link.slug)}</wp:post_name>
      <wp:status>${cdata("publish")}</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type>${cdata("affiliate_link")}</wp:post_type>
      <wp:post_password>${cdata("")}</wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      <wp:postmeta><wp:meta_key>${cdata("target_url")}</wp:meta_key><wp:meta_value>${cdata(link.targetUrl)}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("network")}</wp:meta_key><wp:meta_value>${cdata(link.network)}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("click_count")}</wp:meta_key><wp:meta_value>${cdata("0")}</wp:meta_value></wp:postmeta>
    </item>`);
  });
  console.log(`   ${AFFILIATE_LINKS.length} affiliate links`);

  const catXml = ALL_CATS.map(
    (c, i) => `    <wp:category>
      <wp:term_id>${10 + i}</wp:term_id>
      <wp:category_nicename>${c.slug}</wp:category_nicename>
      <wp:category_parent></wp:category_parent>
      <wp:cat_name>${cdata(c.name)}</wp:cat_name>
      <wp:category_description>${cdata(c.description)}</wp:category_description>
    </wp:category>`,
  ).join("\n");

  const tagXml = [...usedTags.entries()]
    .map(
      ([slug, name], i) => `    <wp:tag>
      <wp:term_id>${100 + i}</wp:term_id>
      <wp:tag_slug>${slug}</wp:tag_slug>
      <wp:tag_name>${cdata(name)}</wp:tag_name>
    </wp:tag>`,
    )
    .join("\n");

  // 5) Navigation menu (primary menu: Best Guides / Tech / AI / Digital Products / Cloudlee Review)
  const NAV_ITEMS = [
    { title: "Best Guides", url: `${SITE}/category/buying-guides/`, order: 1 },
    { title: "Tech", url: `${SITE}/category/tech/`, order: 2 },
    { title: "AI", url: `${SITE}/category/ai/`, order: 3 },
    { title: "Digital Products", url: `${SITE}/category/digital-products/`, order: 4 },
    { title: "Cloudlee Review", url: `${SITE}/category/blog/`, order: 5 },
  ];
  NAV_ITEMS.forEach((nav, i) => {
    items.push(`    <item>
      <title>${cdata(nav.title)}</title>
      <link>${esc(nav.url)}</link>
      <pubDate>${base.toUTCString()}</pubDate>
      <dc:creator>${cdata("cloudpixel")}</dc:creator>
      <guid isPermaLink="false">cloudpixel-nav-${i}</guid>
      <description></description>
      <content:encoded>${cdata("")}</content:encoded>
      <excerpt:encoded>${cdata("")}</excerpt:encoded>
      <wp:post_id>${5001 + i}</wp:post_id>
      <wp:post_date>${cdata(fmtDate(base))}</wp:post_date>
      <wp:post_date_gmt>${cdata(fmtDate(base))}</wp:post_date_gmt>
      <wp:comment_status>${cdata("closed")}</wp:comment_status>
      <wp:ping_status>${cdata("closed")}</wp:ping_status>
      <wp:post_name>${cdata(`nav-${i}`)}</wp:post_name>
      <wp:status>${cdata("publish")}</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>${nav.order}</wp:menu_order>
      <wp:post_type>${cdata("nav_menu_item")}</wp:post_type>
      <wp:post_password>${cdata("")}</wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      <category domain="nav_menu" nicename="primary">${cdata("Primary Menu")}</category>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_type")}</wp:meta_key><wp:meta_value>${cdata("custom")}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_menu_item_parent")}</wp:meta_key><wp:meta_value>${cdata("0")}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_object_id")}</wp:meta_key><wp:meta_value>${cdata(String(5001 + i))}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_object")}</wp:meta_key><wp:meta_value>${cdata("custom")}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_target")}</wp:meta_key><wp:meta_value>${cdata("")}</wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key>${cdata("_menu_item_url")}</wp:meta_key><wp:meta_value>${cdata(nav.url)}</wp:meta_value></wp:postmeta>
    </item>`);
  });

  // Add nav_menu term
  const navTermXml = `    <wp:term>
      <wp:term_id>200</wp:term_id>
      <wp:term_taxonomy>nav_menu</wp:term_taxonomy>
      <wp:term_slug>${cdata("primary")}</wp:term_slug>
      <wp:term_name>${cdata("Primary Menu")}</wp:term_name>
    </wp:term>`;

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
  <title>CloudPixel</title>
  <link>${SITE}</link>
  <description>Honest, in-depth reviews of AI tools</description>
  <pubDate>${base.toUTCString()}</pubDate>
  <language>en-US</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>${SITE}</wp:base_site_url>
  <wp:base_blog_url>${SITE}</wp:base_blog_url>
  <wp:author><wp:author_id>1</wp:author_id><wp:author_login>${cdata("cloudpixel")}</wp:author_login><wp:author_email>${cdata("hello@cloudpixel.com")}</wp:author_email><wp:author_display_name>${cdata("CloudPixel")}</wp:author_display_name><wp:author_first_name>${cdata("")}</wp:author_first_name><wp:author_last_name>${cdata("")}</wp:author_last_name></wp:author>
${catXml}
${tagXml}
${navTermXml}
${items.join("\n")}
</channel>
</rss>
`;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "cloudpixel.xml"), xml, "utf8");
  console.log(
    `✅ ${files.length} reviews + ${GUIDES.length} guides + ${POSTS.length} posts = ${files.length + GUIDES.length + POSTS.length} items`,
  );
  console.log(`   ${ALL_CATS.length} categories, ${usedTags.size} tags → wordpress-export/cloudpixel.xml (${(xml.length / 1024).toFixed(0)} KB)`);
}

main();
