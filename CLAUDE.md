# CLAUDE.md — Ainimix

> Condensed context for Claude Code. Full specs live in `docs/` — read
> `docs/PRD_final.md`, `docs/PDR_final.md`, `docs/TechStack_final.md`, and the
> **v2.1 delta** `docs/ainimix_CHANGES_v2.0_to_v2.1.md` (on conflict, v2.1 wins)
> before adding features.

## What this is

**Ainimix** (formerly "smallcorner") — a hybrid **directory + deep-review +
buying-guide** site for AI tools, software and digital products. Content is
**English**, business model is **affiliate**. Focus is **AI/Tech**. Positioning:
fewer tools, deeper reviews (E-E-A-T), commercial buying guides ("Best AI X"),
and a transparent review process — not a thousand-tool listing. DB-backed and
API-writable (groundwork for later multi-channel content automation).

Taxonomy: **3 scope pillars** — AI / Tools / Digital Products (categories);
functional detail (writing, image, coding, seo…) lives in **tags**.

## Stack

- **Next.js 14 (App Router, TypeScript strict)** — SSG/ISR for SEO.
- **PostgreSQL (Neon)** + **Prisma** — `prisma/schema.prisma`.
- **Tailwind CSS** + shadcn-style components in `src/components/ui`.
- **React Hook Form + Zod** for forms; Zod schemas in `src/schemas`.
- Markdown stored in the DB, rendered with `react-markdown` + `remark-gfm`.
- Hosting: **Vercel**.

## Layout

```
src/app/            routes (App Router)
  page.tsx          Home (directory — card grid + rankings; NOT a news feed)
  tools/[slug]/     deep review page + VerdictBox (the differentiator — PDR §4.3)
  best/[slug]/      best-of buying guide (v2.1 §3.1) · best/ index
  methodology/      "How We Review" (v2.1 §3.3)
  category/[slug]/  category page (3 pillars: ai / tools / digital-products)
  tag/[slug]/       tag page (functional tags)
  full-list/        directory + filters
  blog/             blog / tutorials / news
  search/           search
  go/[slug]/        affiliate redirect (cloaking + click log)
  admin/            protected CRUD (login, tools, affiliate links)
  api/              content (write) · newsletter · search
  opengraph-image.tsx  dynamic branded OG card
src/components/     Card, badges, CTA, VerdictBox, ShareButton, RankingList, forms…
src/features/       data access per domain (tools, guides, posts, categories, tags, search, affiliate)
src/lib/            db, auth, seo, email, affiliate, analytics, utils, constants
src/schemas/        Zod payload schemas
prisma/             schema.prisma (Tool, Category, Tag, AffiliateLink, ClickLog, Post, Subscriber, Guide) + seed.ts
```

## Hard rules (from TechStack §4 — do not break)

1. **No hardcoded secrets** — use `.env` (see `.env.example`).
2. **Every affiliate link routes through `/go/[slug]`** — never inline an
   affiliate URL in content.
3. **Every affiliate/coupon CTA ships with the disclosure line** (use
   `<Disclosure />` / `<AffiliateCTA />`). Never hide it.
4. **No public user accounts / upvotes at MVP** — ranking is editorial
   (`featured` + `editorialRank`) plus click-based trending.
5. **Content must be writable via `POST /api/content`** (auth: `ADMIN_SECRET`
   cookie or `Bearer`). Admin UI and future bots both go through it.
6. **TypeScript strict, no `any`** — use `unknown` + Zod.

## Data access pattern

All reads go through `src/features/*/queries.ts` and are wrapped in
`safeQuery(fn, fallback)` (see `src/lib/db.ts`) so pages render friendly empty
states when `DATABASE_URL` isn't connected yet. Pages use `export const
revalidate = 3600` (ISR).

## Local dev

```bash
npm install
cp .env.example .env        # then set DATABASE_URL (Neon) + ADMIN_SECRET
npx prisma migrate dev      # create tables
npm run db:seed             # categories (7 AI) + affiliate links + posts
npm run import              # tool reviews from content-import/tools/*.md
npm run dev
```

The app **builds and runs without a database** (empty states); connect Neon and
seed to see real data. Admin is at `/admin` (secret set via `ADMIN_SECRET`).

## Content pipeline

Tool reviews live as one Markdown file per tool in `content-import/tools/*.md`
(YAML frontmatter = structured fields, body = review markdown). `npm run import`
validates each against the SAME `toolInputSchema` used by `POST /api/content`,
then upserts by slug (idempotent). `npm run import:check` validates without a DB.
Copy `content-import/tools/_TEMPLATE.md` to author a new review. The category
taxonomy (7 functional AI categories) is in `content-import/categories.ts`,
shared by the seed and the importer.

## Commands

- `npm run dev` · `npm run build` · `npm run start`
- `npm run typecheck` · `npm run lint` · `npm run format`
- `npm run db:seed` · `npm run import` · `npm run import:check`
- `npm run prisma:migrate` · `npm run prisma:deploy`
