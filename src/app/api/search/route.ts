import { NextResponse, type NextRequest } from "next/server";
import { search } from "@/features/search/queries";

export const dynamic = "force-dynamic";

/** GET /api/search?q=… — JSON search over tools + posts (FR-1.5). */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ tools: [], posts: [] });
  const results = await search(q);
  return NextResponse.json(results);
}
