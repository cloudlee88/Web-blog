/**
 * Derive a logo image for a tool when no explicit `logoUrl` is provided.
 * Uses Google's public favicon service (no API key), keyed on the tool's
 * official website domain. An explicit `logoUrl` in the frontmatter always wins,
 * so you can attach a real logo per tool when writing a review.
 */
export function faviconFor(website?: string | null, size = 128): string | null {
  if (!website) return null;
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`;
  } catch {
    return null;
  }
}

/** Effective logo: explicit logoUrl, else a derived favicon, else null. */
export function logoFor(logoUrl?: string | null, website?: string | null, size = 128): string | null {
  return logoUrl || faviconFor(website, size);
}
