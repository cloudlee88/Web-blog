import "server-only";
import { prisma, safeQuery } from "@/lib/db";
import { hashUserAgent, normalizeReferrer } from "@/lib/affiliate";

/** Resolve an affiliate link by slug (for /go redirect + coupon display). */
export async function getAffiliateLink(slug: string) {
  return safeQuery(
    () => prisma.affiliateLink.findUnique({ where: { slug } }),
    null,
  );
}

/** Record an anonymous click (FR-3.4). Best-effort — never blocks the redirect. */
export async function logClick(slug: string, referrer: string | null, userAgent: string | null) {
  try {
    await prisma.clickLog.create({
      data: {
        affiliateSlug: slug,
        referrer: normalizeReferrer(referrer),
        userAgentHash: hashUserAgent(userAgent),
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[cloudpixel] click log failed:", err instanceof Error ? err.message : err);
    }
  }
}
