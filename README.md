# Cloudhub — CloudPixel

> Honest, in-depth reviews of AI tools. A hybrid **directory + deep-review +
> buying-guide** site for AI tools, software and digital products — English
> content, affiliate business model, focused on AI/Tech. Published as
> **CloudPixel**; the codebase / project is **Cloudhub**.

Built with **Next.js 14 (App Router, TS) · Prisma · PostgreSQL (Neon) · Tailwind**.
Full product specs are in [`docs/`](./docs). Engineering context for Claude Code
is in [`CLAUDE.md`](./CLAUDE.md).

## Features (MVP — Phase 1 & 2, incl. v2.1)

- **Directory:** electric-hero home (card grid + rankings — not a news feed),
  3-pillar categories (AI / Tools / Digital Products) + functional tag pages,
  full list with filters, pagination, ILIKE search.
- **Deep review pages** (`/tools/[slug]`): a scannable **VerdictBox** above the
  fold (big score + The Good / The Bad + verdict + CTA), then pricing table,
  use-cases, screenshot, FAQ accordion, similar tools, sticky table of contents.
- **Best-of buying guides** (`/best/[slug]`): ranked shortlists with mini-verdicts,
  scores and affiliate CTAs — targeting commercial "best X" queries.
- **How We Review** (`/methodology`): scoring criteria + editorial independence (E-E-A-T).
- **Affiliate:** cloaked `/go/[slug]` redirects with anonymous click logging,
  affiliate CTAs with an always-visible disclosure, and coupon blocks.
- **Rankings:** editorial (`featured` + `editorialRank`) and click-based
  **trending** (7-day window).
- **Blog / Tutorials / News** with markdown stored in the DB.
- **Admin** (`/admin`, protected by `ADMIN_SECRET`): tool CRUD, affiliate-link
  management, login/logout.
- **Content API** (`POST /api/content`): single write entry point for admin and
  future automation.
- **SEO & social:** dynamic metadata, dynamic **OG images**, **Share** buttons,
  auto sitemap + robots, JSON-LD (Review / FAQ / Article / ItemList). Newsletter
  form wired to ConvertKit **or** Brevo. GA4 events.

## Quick start

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL (Neon) and a strong ADMIN_SECRET
```

The site **runs without a database** — you'll see friendly empty states. To load
real data you have two options:

**Option A — zero-setup local Postgres (embedded, no Docker/Neon).** Best for
local preview. `.env` ships pointing at it already.

```bash
npm run dev:db             # terminal 1 — embedded Postgres on :5432 (data in ./.localdb)
npx prisma db push         # terminal 2 — create tables
npm run db:seed            # categories + affiliate links + posts + buying guides
npm run import             # 20 tool reviews from content-import/tools/*.md
npm run dev                # http://localhost:3000
```

**Option B — Neon (for production / Vercel).** Set `DATABASE_URL` in `.env` to
your Neon URL, then `npx prisma migrate deploy && npm run db:seed && npm run import`.

### Adding tool reviews

Reviews are Markdown files in [`content-import/tools/`](./content-import/tools)
— YAML frontmatter for the structured fields, the body for the review prose.
Copy [`_TEMPLATE.md`](./content-import/tools/_TEMPLATE.md), fill it in, then:

```bash
npm run import:check   # validate the files (no DB needed)
npm run import         # upsert them into the DB (idempotent)
```

Admin dashboard: <http://localhost:3000/admin> (enter your `ADMIN_SECRET`).

## Environment variables

See [`.env.example`](./.env.example). Summary:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres (Neon) connection string |
| `ADMIN_SECRET` | Protects `/admin` and `POST /api/content` |
| `ESP_PROVIDER` / `ESP_API_KEY` / `ESP_FORM_ID` / `ESP_LIST_ID` | Newsletter (ConvertKit or Brevo) — optional |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement id — optional |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (used in metadata, sitemap, OG) |

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars above (set `NEXT_PUBLIC_SITE_URL` to your domain).
3. Set the **Build Command** to `prisma generate && prisma migrate deploy && next build`
   (or run `prisma migrate deploy` in a deploy hook), then deploy.
4. Run the seed once against production if desired: `npm run db:seed`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run dev:db` | Start the embedded local Postgres (no Docker needed) |
| `npm run db:seed` | Seed categories, affiliate links, posts & guides |
| `npm run import` | Import tool reviews from `content-import/tools/*.md` |
| `npm run import:check` | Validate the review files without a DB |
| `npm run prisma:migrate` | `prisma migrate dev` |
| `npm run prisma:deploy` | `prisma migrate deploy` (production) |

## Project docs

- [PRD](./docs/PRD_final.md) — product requirements
- [PDR](./docs/PDR_final.md) — design requirements
- [TechStack](./docs/TechStack_final.md) — architecture & rules
- [Implementation Plan](./docs/Implementation_Plan_final.md) — phased roadmap
