import { slugify } from "./utils";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract level-2/3 headings from markdown to build a table of contents.
 * Ids are slugified to match the ids the renderer assigns to headings.
 */
export function extractHeadings(markdown: string | null | undefined): Heading[] {
  if (!markdown) return [];
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1]!.length as 2 | 3;
    const text = match[2]!.replace(/[#*`]/g, "").trim();
    let id = slugify(text);
    // De-duplicate repeated headings.
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    headings.push({ id, text, level });
  }
  return headings;
}
