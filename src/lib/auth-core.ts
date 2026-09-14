/**
 * Edge-safe auth primitives (no `next/headers` import) so they can be used from
 * middleware as well as server components / route handlers.
 */
export const ADMIN_COOKIE = "sc_admin";

/** Constant-time-ish string compare (avoids trivial early-exit timing leak). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
