---
# ─────────────────────────────────────────────────────────────────────────
# Tool review template. Copy this file to <slug>.md and fill it in.
# Files starting with "_" are ignored by the importer.
# Required: slug, name, shortDesc. Everything else is optional but recommended.
# Validated against toolInputSchema — run `npm run import:check` to verify.
# ─────────────────────────────────────────────────────────────────────────
slug: example-tool                 # lowercase-hyphenated; becomes /tools/<slug>
name: Example Tool
categorySlug: ai-writing           # one of the 7 category slugs (see content-import/categories.ts)
tags: [writing, seo]               # lowercase-hyphenated tag slugs
shortDesc: One honest sentence describing what the tool does (shown on cards).
rating: 4.3                        # 0.0–5.0
pricing: FREEMIUM                  # FREE | FREEMIUM | PAID
editorialRank: 12                  # optional; lower = higher in rankings
featured: false
verified: true                     # true only if you actually tested it (the "Tested" badge)
verdict: >
  Two or three sentences: the honest bottom line, shown at the top of the review.
website: https://example.com       # official (non-affiliate) URL
# Images (optional). If logoUrl is omitted, a logo is auto-derived from the
# website domain. Set these to attach your own logo / screenshot image.
logoUrl:                           # e.g. https://cdn.example.com/logo.png
screenshotUrl:                     # e.g. https://cdn.example.com/screenshot.png
affiliateSlug: example-tool        # optional; must match an AffiliateLink slug → routes via /go/<slug>
pros:
  - First genuine strength
  - Second strength
cons:
  - First honest limitation
  - Second limitation
useCases:
  - Who/what it's ideal for #1
  - Who/what it's ideal for #2
pricingTiers:
  - name: Free
    price: "$0"
    features: ["What you get", "And this"]
  - name: Pro
    price: "$20/mo"
    features: ["Everything in Free", "Plus this"]
faq:
  - q: Is it free?
    a: A short, direct answer.
  - q: Another common question?
    a: Another answer.
metaTitle: Example Tool Review (2026) — Honest Verdict
metaDescription: A tested, honest review of Example Tool — pros, cons, pricing and who it's for.
---

## Overview

Open with what the tool is and who makes it. Use `##` headings — they become the
table of contents automatically.

## What it's good at

Be specific and concrete. This is where E-E-A-T lives: show you actually used it.

## Where it falls short

Every honest review has this section. Name the real limitations.

## Should you use it?

Give a clear recommendation for each type of reader.
