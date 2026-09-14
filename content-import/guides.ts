/**
 * Best-of buying guides (shared by prisma/seed.ts and the WordPress exporter).
 * `items` reference reviews by tool slug; the exporter links them to /<slug>/.
 */
export interface SeedGuideItem {
  toolSlug: string;
  rank: number;
  miniVerdict: string;
  score: number;
}

export interface SeedGuide {
  slug: string;
  title: string;
  intro: string;
  items: SeedGuideItem[];
  metaTitle: string;
  metaDescription: string;
}

export const GUIDES: SeedGuide[] = [
  {
    slug: "best-ai-chatbots-2026",
    title: "The Best AI Chatbots & Assistants in 2026",
    intro:
      "We tested the major AI assistants on real work — writing, research and code. Here are the ones worth your time, ranked, with the honest bottom line on each.",
    items: [
      { toolSlug: "claude", rank: 1, miniVerdict: "Best for writing and long documents — natural voice, huge context.", score: 4.8 },
      { toolSlug: "chatgpt", rank: 2, miniVerdict: "The most versatile all-rounder and the safest place to start.", score: 4.7 },
      { toolSlug: "gemini", rank: 3, miniVerdict: "Best if you live in Google Workspace; strong multimodal.", score: 4.4 },
      { toolSlug: "perplexity", rank: 4, miniVerdict: "Best for research — every answer comes with sources.", score: 4.5 },
    ],
    metaTitle: "Best AI Chatbots 2026 — Ranked & Honestly Reviewed",
    metaDescription: "Our tested ranking of the best AI chatbots and assistants in 2026 — ChatGPT, Claude, Gemini and Perplexity compared.",
  },
  {
    slug: "best-ai-writing-tools-ranked-2026",
    title: "The Best AI Writing Tools in 2026",
    intro:
      "From general assistants to dedicated marketing platforms — the AI writing tools that actually earn their price, ranked.",
    items: [
      { toolSlug: "jasper", rank: 1, miniVerdict: "Best for marketing teams needing brand voice at scale.", score: 4.1 },
      { toolSlug: "copy-ai", rank: 2, miniVerdict: "Great for short-form copy and go-to-market workflows.", score: 4.0 },
      { toolSlug: "grammarly", rank: 3, miniVerdict: "Best everyday editor — fixes your writing everywhere you type.", score: 4.4 },
    ],
    metaTitle: "Best AI Writing Tools 2026 — Ranked & Reviewed",
    metaDescription: "Our tested ranking of the best AI writing tools in 2026 — Jasper, Copy.ai and Grammarly compared with pros, cons and pricing.",
  },
  {
    slug: "best-ai-image-generators-2026",
    title: "The Best AI Image Generators in 2026",
    intro:
      "Whether you want the most beautiful output, the most control, or the easiest workflow — these are the AI image tools we recommend, ranked.",
    items: [
      { toolSlug: "midjourney", rank: 1, miniVerdict: "Best-looking output — the benchmark for AI imagery.", score: 4.5 },
      { toolSlug: "leonardo-ai", rank: 2, miniVerdict: "Most control and a real free tier; great for assets.", score: 4.2 },
      { toolSlug: "ideogram", rank: 3, miniVerdict: "Best at legible text inside images.", score: 4.1 },
      { toolSlug: "canva", rank: 4, miniVerdict: "Easiest for non-designers — AI baked into a familiar app.", score: 4.6 },
    ],
    metaTitle: "Best AI Image Generators 2026 — Ranked & Reviewed",
    metaDescription: "Our tested ranking of the best AI image generators in 2026 — Midjourney, Leonardo AI, Ideogram and Canva compared.",
  },
];
