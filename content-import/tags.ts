/**
 * Canonical tag (sub-category) taxonomy. Authored tags in the .md files stay as
 * written; this layer normalises them at import + export so the site shows a
 * tidy, consistent set of "types" (Coding, Video, Writing, …) instead of many
 * near-duplicates (developer/editor/agent → coding, etc.).
 */

/** alias slug → canonical slug */
const ALIAS: Record<string, string> = {
  developer: "coding",
  editor: "coding",
  agent: "coding",
  art: "image",
  vector: "design",
  typography: "design",
  avatar: "video",
  animation: "video",
  editing: "video",
  training: "video",
  voice: "audio",
  transcription: "meetings",
  notes: "productivity",
  docs: "productivity",
  collaboration: "productivity",
  communication: "productivity",
  "project-management": "productivity",
  planning: "productivity",
  calendar: "productivity",
  integrations: "automation",
  content: "writing",
  search: "research",
  social: "marketing",
};

/** vague / noisy tags to drop entirely */
const DROP = new Set(["generation", "realtime", "multimodal", "google", "privacy"]);

/** display-name overrides (acronyms, digital-product types); else Title Case */
const NAME: Record<string, string> = {
  seo: "SEO",
  ebooks: "E-books & Audiobooks",
  courses: "Online Courses",
  templates: "Templates & Planners",
  themes: "Website Themes",
  graphics: "Graphics & Design Assets",
  "stock-photos": "Stock Photos",
  fonts: "Fonts & Typography",
  printables: "Printables",
  "digital-art": "Digital Art Prints",
  "ai-prompts": "AI Prompts & Assets",
  software: "Software & Apps",
  "music-audio": "Music & Audio",
  memberships: "Memberships",
  spreadsheets: "Spreadsheets & Finance",
  "marketing-kits": "Marketing Kits",
  wellness: "Wellness & Meal Plans",
};

/** Normalise a list of authored tags to canonical, deduped slugs. */
export function canonicalTagSlugs(tags: unknown): string[] {
  const list = Array.isArray(tags) ? tags : [];
  const out = new Set<string>();
  for (const raw of list) {
    const t = String(raw).toLowerCase().trim();
    if (!t || DROP.has(t)) continue;
    out.add(ALIAS[t] ?? t);
  }
  return [...out];
}

/** Human-readable name for a tag slug. */
export function tagDisplayName(slug: string): string {
  return NAME[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
