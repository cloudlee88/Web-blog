import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, safeEqual } from "@/lib/auth-core";

/**
 * Gate /admin (except the login page) and POST /api/content behind ADMIN_SECRET.
 * Runs on the edge; reads the cookie / bearer token directly (no Prisma here).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.ADMIN_SECRET;

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = !!secret && !!cookie && safeEqual(cookie, secret);

  // Protect the admin UI (allow the login page through).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect write API. Allow either cookie or Bearer token (for automation).
  if (pathname.startsWith("/api/content")) {
    const bearer = req.headers.get("authorization");
    const bearerOk =
      !!secret && bearer?.startsWith("Bearer ") && safeEqual(bearer.slice(7).trim(), secret);
    if (!authed && !bearerOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*"],
};
