import { cookies } from "next/headers";
import { ADMIN_COOKIE, safeEqual } from "./auth-core";

/**
 * Minimal admin auth (TechStack §3): a shared ADMIN_SECRET protects /admin and
 * POST /api/content. No public user accounts at MVP. Two ways to authenticate:
 *   - Browser: an httpOnly `sc_admin` cookie set on login equal to ADMIN_SECRET.
 *   - Bots/automation: `Authorization: Bearer <ADMIN_SECRET>` header.
 */
export { ADMIN_COOKIE, safeEqual } from "./auth-core";

function secret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

/** Server component / server action check: is the current session an admin? */
export function isAdmin(): boolean {
  const s = secret();
  if (!s) return false;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  return !!cookie && safeEqual(cookie, s);
}

/** Route-handler check accepting either the admin cookie or a Bearer token. */
export function isAuthorizedRequest(req: Request): boolean {
  const s = secret();
  if (!s) return false;

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return safeEqual(auth.slice(7).trim(), s);
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)sc_admin=([^;]+)/);
  if (match?.[1]) return safeEqual(decodeURIComponent(match[1]), s);

  return false;
}
