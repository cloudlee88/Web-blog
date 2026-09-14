/**
 * Curated sub-category taxonomy per pillar. Used by the category page to show a
 * "Browse by type" grid even before products exist (data-driven counts are
 * merged in when available). Pillars NOT listed here fall back to purely
 * data-driven sub-categories (from the tags their tools actually use).
 *
 * Digital Products taxonomy is based on Amasty's "Best digital products to
 * sell" (18 types), consolidated into a clean set.
 */
export interface CuratedSub {
  slug: string;
  name: string;
}

export const SUBCATEGORIES: Record<string, CuratedSub[]> = {
  "digital-products": [
    { slug: "ebooks", name: "E-books & Audiobooks" },
    { slug: "courses", name: "Online Courses" },
    { slug: "templates", name: "Templates & Planners" },
    { slug: "themes", name: "Website Themes" },
    { slug: "graphics", name: "Graphics & Design Assets" },
    { slug: "stock-photos", name: "Stock Photos" },
    { slug: "fonts", name: "Fonts & Typography" },
    { slug: "printables", name: "Printables" },
    { slug: "digital-art", name: "Digital Art Prints" },
    { slug: "ai-prompts", name: "AI Prompts & Assets" },
    { slug: "software", name: "Software & Apps" },
    { slug: "music-audio", name: "Music & Audio" },
    { slug: "memberships", name: "Memberships" },
    { slug: "spreadsheets", name: "Spreadsheets & Finance" },
    { slug: "marketing-kits", name: "Marketing Kits" },
    { slug: "wellness", name: "Wellness & Meal Plans" },
  ],
};
