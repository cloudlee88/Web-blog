import { NextResponse, type NextRequest } from "next/server";
import { getAffiliateLink, logClick } from "@/features/affiliate/queries";

export const dynamic = "force-dynamic"; // never cache — must log every click

/**
 * Cloaked affiliate redirect (FR-3.2 / FR-3.4). Resolves the slug, logs an
 * anonymous click, then 302-redirects to the real target. Unknown/inactive
 * slugs get a friendly message instead of a blank page (PDR §7).
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const link = await getAffiliateLink(params.slug);

  if (!link || !link.active) {
    const url = req.nextUrl.clone();
    url.pathname = "/link-unavailable";
    url.search = "";
    return NextResponse.redirect(url, 307);
  }

  // Fire-and-forget the click log so it never delays the redirect.
  await logClick(params.slug, req.headers.get("referer"), req.headers.get("user-agent"));

  return NextResponse.redirect(link.targetUrl, 302);
}
