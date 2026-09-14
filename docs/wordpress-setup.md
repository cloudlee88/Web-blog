# CloudPixel on WordPress — migration & setup

You've decided to run CloudPixel on **WordPress** instead of the custom Next.js app.
This guide covers what changes, what I've prepared, and the exact steps.

## What changes

| | Custom Next.js (built) | WordPress (new plan) |
|---|---|---|
| Runtime | Next.js on Vercel | WordPress (PHP) on a WP host |
| Database | Neon (Postgres) — **dropped** | WordPress's own MySQL (from host) |
| CMS / admin / editor | custom-coded | built-in |
| Content automation | `/api/content` | **WordPress MCP** (REST API) |

**Dropped:** the Next.js code, Prisma, **Neon**, custom admin/API. **Kept/reused:**
the 20 reviews (exported below), taxonomy (Tech/AI/Digital + tags), positioning,
affiliate rules, and the design direction (pick a matching theme).

> The Next.js version still runs locally (`npm run dev` + `npm run dev:db`) if you
> want it as a reference for design/content while setting up WordPress.

## What I've prepared

**`wordpress-export/cloudpixel.xml`** — a WordPress import file (WXR) with **129
items**: **46 tool reviews** (title, full body — verdict, the good/bad, pricing,
use-cases, FAQ — excerpt, Visit link + affiliate disclosure), **3 buying guides**
(ranked, linking to the reviews) and **80 blog / tutorial / news / review posts**,
plus 12 affiliate links (as a CPT) and the primary menu. Organised into 8
categories (Tech / AI / Digital Products / Buying Guides / Cloudlee Review +
product topics) + 26 tags. Internal links are rewritten to WordPress permalinks
(`/<slug>/`). Imports with WP's built-in importer — no plugin required.

**`wordpress-theme/cloudpixel-theme.zip`** — a custom WordPress theme that recreates
the CloudPixel design (navy + deep-blue palette, decorated hero, navy buttons, soft
cards, styled review layout) in plain PHP + CSS. It also **registers the review
meta fields (`cloudpixel_rating`, `cloudpixel_pricing`, …) and the affiliate-link
CPT in the REST API**, so a WordPress MCP can read and write them out of the box.
Install it and the imported content looks like the site — no page builder needed.

Re-generate anytime after editing `content-import/tools/*.md`:
```bash
npx tsx scripts/export-wxr.mts   # → wordpress-export/cloudpixel.xml
```

## Step-by-step

### 1. Get a self-hosted WordPress
You need **WordPress.org (self-hosted)**, not the free WordPress.com — the MCP and
affiliate/SEO plugins require plugin installs + REST API. Affordable managed hosts:
Hostinger / SiteGround / Bluehost (~$3–8/mo intro). Install WordPress (1-click on
most hosts). **Cost is no longer ~$0** — budget for hosting.

### 2. Import the content
1. In WP admin: **Settings → Permalinks → “Post name”** (so slugs match).
2. **Tools → Import → WordPress** → install the importer → upload
   `wordpress-export/cloudpixel.xml`.
3. Assign the author, check “Download and import file attachments”, run it.
   → 129 posts + 8 categories + 26 tags + the primary menu appear.

### 3. Theme — install the CloudPixel theme (recreates the design)
We converted the site's design into a real WordPress theme:
**`wordpress-theme/cloudpixel-theme.zip`**.

1. WP admin → **Appearance → Themes → Add New → Upload Theme**.
2. Choose `cloudpixel-theme.zip` → **Install Now** → **Activate**.
3. **Settings → Reading → Your homepage displays: “Your latest posts”** (the
   theme's `front-page.php` renders the hero + featured reviews automatically).
4. Optional: **Appearance → Menus** → create a menu (Best Guides, the 3
   categories, Blog) and assign it to **Primary**. Without a menu it falls back
   to your categories.

This gives the navy + deep-blue look, navy buttons, decorated hero, cards and the
styled review layout — pulling in the posts you imported. Alternatively you
could use a generic theme (Kadence/Blocksy) + custom CSS, but the bundled theme
is the closest match with no configuration.

### 4. Essential plugins
- **SEO + schema:** Rank Math (free) — review/article schema, sitemap, meta.
- **Affiliate link cloaking + disclosure:** ThirstyAffiliates or Pretty Links —
  replaces our `/go/[slug]`; set links `nofollow sponsored`, manage centrally,
  and keep the disclosure near every CTA (our hard rule carries over).
- **Speed / Core Web Vitals:** LiteSpeed Cache (free, if host supports) or WP Rocket.
- **Newsletter:** your ESP's plugin (ConvertKit / Brevo).
- **Buying guides:** rebuild the “Best AI X” ranked lists as posts using the
  theme's comparison/rating blocks, linking to the review posts.

### 5. WordPress MCP (content automation)
This is the payoff of going WordPress — an AI agent publishing straight to the site.
1. Install a **WordPress MCP plugin** (e.g. Automattic's official WordPress MCP, or
   a community `wp-mcp` server that wraps the WP REST API).
2. **Users → Profile → Application Passwords** → create one for the agent.
3. Add the site to Claude as an MCP connector using the site URL + application
   password (needs HTTPS + REST API enabled).
4. Then you can ask Claude to draft/publish reviews directly into WordPress.

> No WordPress MCP is pre-listed in this session's connector registry, so it'll be
> a **custom** connector. Once your site is live, share the URL and I'll help wire
> it up and script the “1 review → publish” flow.

## Notes
- Keep the affiliate rules: every affiliate/coupon CTA needs a visible disclosure;
  route affiliate links through the cloaking plugin.
- Content source of truth can stay as `content-import/tools/*.md` (re-export WXR),
  or move fully into WordPress once the MCP flow is running.
