import { createHash } from "crypto";

/**
 * Hash a user-agent string so click logs stay anonymous (TechStack §6:
 * "hash UA, không lưu IP đầy đủ"). Salted with ADMIN_SECRET so hashes are not
 * trivially reversible / rainbow-tableable across deployments.
 */
export function hashUserAgent(ua: string | null): string | null {
  if (!ua) return null;
  const salt = process.env.ADMIN_SECRET ?? "cloudpixel";
  return createHash("sha256").update(salt + ua).digest("hex").slice(0, 32);
}

/** Normalise a referrer down to its origin (drops query strings / PII). */
export function normalizeReferrer(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).origin;
  } catch {
    return null;
  }
}
