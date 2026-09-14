# CloudPixel — Handover (design · effects · content · structure · flow)

Everything needed to run, style, and extend **CloudPixel** — the AI-tool review
directory. There are **two builds of the same product and design**:

| Build | Location | Runtime | Role |
|---|---|---|---|
| **Next.js** (canonical) | `src/` | Next 14 on Vercel | Reference design + fully-featured site |
| **WordPress** (ported) | `wordpress-theme/cloudpixel/` + `wordpress-export/cloudpixel.xml` | PHP on any WP host | The build you're connecting WP MCP to |

Brand: **website = CloudPixel**, the blog section = **Cloudlee Review**. Project/repo = **Cloudhub**.

---

## 0. ⚠️ Read first — why the site currently looks broken

Your screenshot (cloudpixelhub.com) shows the **imported content rendering under a
default WordPress block theme** — not a CloudPixel bug. Tell-tale signs: the header
is "Praise The Sun / Sample Page" (a fresh-install placeholder), there's no
CloudPixel logo/nav, and the Canva verdict box shows as raw text ("4.6out of 5",
"Canva✓ TestedFreemium" run together). That HTML is **correct** — it just needs the
theme's CSS. **The CloudPixel theme is not activated.**

The theme (`.php`) and the import file (`.xml`) were both re-checked and are valid:
`cloudpixel.xml` is well-formed XML; the theme requires **PHP 8.0+** and has no
activation-blocking errors. Fix it in the WP admin (2 minutes):

1. **Appearance → Themes → Add New → Upload Theme** → `wordpress-theme/cloudpixel-theme.zip` → **Install Now → Activate**.
2. **Settings → General** → Site Title = `CloudPixel`, Tagline = `Honest, in-depth reviews of AI tools`.
3. **Settings → Reading** → *Your homepage displays* = **Your latest posts** (the theme's `front-page.php` then renders the hero + sections).
4. **Settings → Permalinks** → **Post name** (so `/canva/` style links resolve) → Save.
5. *(optional)* **Appearance → Menus** → assign the imported **Primary Menu**, or the theme falls back to Best Guides / Tech / AI / Digital Products / Cloudlee Review.

After step 1 the verdict box becomes a styled card (navy score box, green "The Good"
/ red "The Bad" columns, navy Visit CTA) and the homepage becomes the decorated hero
+ card grid.

> **Requirement:** self-hosted WordPress on **PHP 8.0+** with the REST API enabled
> (needed both by the theme's `str_contains()` usage and by WP MCP).

---

## 1. UI design system

Enterprise-SaaS "Trackit" aesthetic: white base, **navy near-black** for solid
CTAs/dark surfaces, **deep royal blue** as the one accent. No loud colors — color
lives only in small accents (links, icons, badges, the score box).

### Palette (identical in both builds)

| Token | Hex | Role |
|---|---|---|
| Background | `#FFFFFF` | Page / card base |
| Foreground (heading) | `#0B0E1A` | Near-black navy headings & body |
| **Navy** | `#0B1220` | Solid CTA buttons, logo badge, dark surfaces |
| **Primary (blue)** | `#1D4ED8` | Links, icons, focus rings, score box, active states |
| Blue partner | `#2554E8` | Hover/gradient partner, hero glow |
| Accent (light blue) | `#CFE0FB` | Chips, active nav, icon backgrounds |
| Muted | `#F8F9FB` | Alternating section background |
| Muted text | `#667085` | Secondary text |
| Border | `#E4E7EC` | Card borders, dividers |
| Success / growth | text `#16A34A` on `#DCFCE7` | "The Good", ▲ deltas, "Tested" badge |
| Danger | text `#DC2626` on `#FEE2E2` | "The Bad" |
| Gold | `#FBBF24` | Rating stars |
| Accent trio | `#6366F1` (indigo), `#0EA5E9` (sky) | Step / ranking icon chips |

The token source of truth: `src/app/globals.css` (`:root` CSS variables) for Next.js;
`wordpress-theme/cloudpixel/style.css` (`:root`) for WP — same values, same names.

### Typography
- **Body:** Inter (400–700).
- **Headings:** Space Grotesk (500–700), letter-spacing `-0.02em`, tight line-height.
- Hero H1 `clamp(2.4rem, 6vw, 4.2rem)`; section H2 `clamp(1.8rem, 4vw, 2.4rem)`.

### Shape & depth
- **Radius hierarchy** (deliberately not uniform): buttons **10px**, small cards **12px**, cards/panels **16px**, big mockup **20px**, pills/badges **999px**.
- **Shadow:** soft, wide, navy — `0 16px 40px -20px rgba(16,24,40,0.16)`. No hard borders on shadows.
- **Buttons:** primary = solid **navy**, white text, 10px radius (never a pill, never a violet gradient); secondary = white + 1px `#E4E7EC` border.
- **Badges:** small pills, pastel bg + same-tone text; per-type colors (Tested = green, Freemium = blue, Paid = amber, Featured = blue).

---

## 2. Effects (hiệu ứng)

### Hero decoration — 6 low-opacity layers (both builds)
Layered bottom→top so text stays fully legible:
1. **Corner glows** — two radial blue glows (`rgba(37,84,232,~0.16)`) at top-left & top-right, fading to white.
2. **Dot-grid** — dot pattern in the **top-right corner only**, masked to fade inward.
3. **Sunburst lines** — thin diagonal lines radiating from the four corners (~6% opacity).
4. **Concentric rings** — 3 faint circles behind the search/CTA (a "ripple").
5. **Sparkles** — 4 scattered ✦ glints.
6. (Next.js only) a **dashboard mockup card** below the search — see below.

Next.js implementation: [`src/components/hero-decoration.tsx`](../src/components/hero-decoration.tsx).
WP implementation: inline `<div class="hero-decoration">` SVGs in
`front-page.php` + `.hd-*` rules in `style.css` (ported this session).

### Micro-interactions
- Header: sticky, `backdrop-filter: blur`, translucent white.
- Cards: `hover` lifts shadow; links → primary blue on hover; `transition ~0.15s ease`.
- Search field: focus ring in primary blue.
- Verdict CTA / affiliate links: navy button with a trailing `→`.

### Next.js-only (not ported to WP)
- The **hero dashboard mockup** ([`src/components/hero-mockup.tsx`](../src/components/hero-mockup.tsx)) — an illustrative editorial dashboard (sidebar, metric cards with green ▲ delta pills, a floating navy play button, a blue area chart, a "Top rated" list). It's a decorative marketing element; the WP hero is content-first and omits it. **Say the word and I'll port it into `front-page.php` as static HTML/SVG.**

---

## 3. Content model

### Post types
- **`post`** — every review, buying guide, and blog/tutorial/news article.
- **`affiliate_link`** (custom post type, `show_in_rest`) — a cloaked redirect. `/go/<slug>` → 302 to its `target_url`, incrementing `click_count`.

### Categories (8, imported by the WXR)
`tech` · `ai` · `digital-products` (the 3 pillars) · `buying-guides` (Best Guides) ·
`blog` → **"Cloudlee Review"** (the editorial blog) · plus product topics
`lifestyle` · `beauty-fashion` · `entertainment`.

### Tags
Functional detail (writing, image, coding, seo, chatbot, …) — 26 seeded. Power the
"Browse by type" grids and `/category/<slug>/?type=<tag>` filtering.

### Post meta — the data contract (theme ↔ export ↔ MCP)
Registered in `functions.php` with `show_in_rest => true`, so **WP MCP / the REST API
can read and write them**. The theme reads them to render cards, rankings and the
verdict box.

| Meta key | Values | Used for |
|---|---|---|
| `cloudpixel_rating` | e.g. `"4.6"` | Card rating, VerdictBox score, "Top rated" sort |
| `cloudpixel_pricing` | `FREE` \| `FREEMIUM` \| `PAID` | Pricing badge |
| `cloudpixel_website` | URL | "Visit" CTA + logo favicon fallback |
| `cloudpixel_logo_url` | URL | Card / VerdictBox logo |
| `cloudpixel_verified` | `"1"` \| `"0"` | "Tested" badge |
| `cloudpixel_featured` | `"1"` \| `""` | "Featured" badge |
| `cloudpixel_editorial_rank` | number string | Editorial ordering |
| `cloudpixel_ptype` | `blog`\|`tutorial`\|`news`\|`review` | Blog post-type tabs |
| `cloudpixel_topic` | `lifestyle`\|`beauty-fashion`\|`entertainment` | Review sub-topic filter |
| `target_url` / `network` / `click_count` | on `affiliate_link` | Redirect + click log |

### The review body HTML
Reviews import as **self-contained HTML** so they read well on any theme, and get
fully styled once CloudPixel is active. Structure (generated by `scripts/export-wxr.mts`,
styled by the `.verdict-box` CSS):

```html
<div class="verdict-box">
  <div class="vb-top">
    <div class="vb-logo"><img src="…logo…"></div>
    <div class="vb-score"><span class="vb-num">4.6</span><span class="vb-out">out of 5</span></div>
    <div class="vb-verdict">
      <div class="vb-head"><span class="vb-name">Canva</span>
        <span class="vb-badge vb-tested">✓ Tested</span>
        <span class="vb-badge vb-price">Freemium</span></div>
      <span class="vb-label">Our verdict</span><p>…verdict…</p>
    </div>
  </div>
  <div class="vb-cols">
    <div class="vb-good"><h4>The Good</h4><ul><li>…</li></ul></div>
    <div class="vb-bad"><h4>The Bad</h4><ul><li>…</li></ul></div>
  </div>
  <div class="vb-cta"><a href="…" rel="nofollow sponsored noopener">Visit Canva</a></div>
</div>
<!-- then: screenshot, review prose, <h2>Pricing</h2>, Who it's for, FAQ -->
```

---

## 4. Structure — theme file map

| File | Renders |
|---|---|
| `style.css` | Theme header + the entire design system (`:root` tokens → all components) |
| `functions.php` | Setup, nav menus, **`cloudpixel_card()`** (list card), `cloudpixel_post_logo()`, category-type filters, **REST meta registration**, **`affiliate_link` CPT + `/go/<slug>` redirect**, fallback menu |
| `header.php` | Sticky header: navy "C" badge + site name + primary nav (or fallback) |
| `front-page.php` | Homepage: **decorated hero** → Featured → How it works → Why trust (+ stats) → Browse by category → Buying guides → **Rankings** (Editor's picks / Trending / Top rated) → Newsletter CTA |
| `index.php` | Blog/posts listing (card grid + pagination) |
| `archive.php` | Category / tag / date archives, with the "Browse by type" sub-filter |
| `single.php` | One review: breadcrumb → title → meta → the verdict HTML (`the_content()`) → tags → related reviews |
| `page.php` | Static pages (About, Methodology, Affiliate Disclosure, Contact) |
| `search.php` / `searchform.php` | Search results / the search field |
| `footer.php` | Footer columns + disclosure line |

---

## 5. Flow — how a visitor and content move through the site

**Visitor flow:** Home (`front-page.php`) → click a pillar → **category archive**
(`archive.php`, optional `?type=<tag>` filter) → **single review** (`single.php`,
the verdict box) → **Visit** button → **`/go/<slug>`** (301/302 cloaked redirect via
the `affiliate_link` CPT, logs a click) → the tool's site.

**Content-authoring flows (two, both land in WordPress):**

1. **Bulk import (done once):** `content-import/*` → `npx tsx scripts/export-wxr.mts`
   → `wordpress-export/cloudpixel.xml` → **Tools → Import → WordPress**. Produces 129
   items (46 reviews, 3 guides, 80 posts, 12 affiliate links, menu) + 8 categories +
   26 tags. Re-run the export anytime you edit `content-import/tools/*.md`.

2. **Ongoing via WP MCP (the reason you're on WordPress):** an agent creates/updates
   posts straight through the REST API. **To publish a review correctly, the MCP must
   set the same three things the theme reads:**
   - **Content** — the review HTML (reuse the `.verdict-box` structure above, or plain
     prose; the theme styles `.entry-content` either way).
   - **Meta** — at least `cloudpixel_rating`, `cloudpixel_pricing`, `cloudpixel_website`,
     `cloudpixel_verified`, `cloudpixel_featured` (these drive the list-card badges and
     the "Top rated" ranking). Sent via the REST `meta` object — they're registered
     with `show_in_rest`.
   - **Taxonomy** — `categories` (a pillar) + `tags` (functional).

   A minimal REST create looks like:
   ```
   POST /wp-json/wp/v2/posts
   { "title":"…", "status":"publish", "content":"<div class=\"verdict-box\">…",
     "categories":[<ai id>], "tags":[<id>,…],
     "meta":{ "cloudpixel_rating":"4.6", "cloudpixel_pricing":"FREEMIUM",
              "cloudpixel_website":"https://…", "cloudpixel_verified":"1" } }
   ```
   Auth: **Users → Profile → Application Passwords** → give the value to the MCP
   connector (site URL + app password, HTTPS required).

---

## 6. Connecting WP MCP
1. Install a WordPress MCP plugin (Automattic's official WordPress MCP, or a community
   `wp-mcp` that wraps the REST API).
2. Create an **Application Password** for the agent user.
3. Add the site to Claude as a **custom** connector (URL + app password).
4. The CloudPixel theme already exposes the review meta and the `affiliate_link` CPT to
   REST, so the agent can read/write them with no extra plugin. Ask it to "draft a
   review of X" and have it fill content + the meta table above.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Verdict box shows as plain text; header says "Sample Page" | CloudPixel theme not active | Activate `cloudpixel-theme.zip` (§0) |
| Homepage is a plain blog list, no hero | Homepage set to a static page, or theme inactive | Activate theme; Settings → Reading → latest posts |
| Cards show no rating/badges | Post is missing `cloudpixel_*` meta | Set the meta (§3 table) via editor "Custom fields" or MCP |
| Links 404 (`/canva/` etc.) | Permalinks not "Post name" | Settings → Permalinks → Post name → Save |
| Theme won't activate / "fatal error" | Host on PHP < 8.0 | Switch the site to PHP 8.0+ |
| `/go/<slug>` 404s | Rewrite rules stale | Settings → Permalinks → Save (flushes rules) |

## 8. Regenerating artifacts
```bash
npx tsx scripts/export-wxr.mts        # → wordpress-export/cloudpixel.xml
cd wordpress-theme && zip -rq cloudpixel-theme.zip cloudpixel -x "*.DS_Store"
```
Both files stay in sync via the shared `cloudpixel_*` meta keys — if you rename a meta
key, change it in **both** `functions.php` and `scripts/export-wxr.mts`.
