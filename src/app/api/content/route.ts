import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { contentEnvelopeSchema } from "@/schemas/content";
import { upsertTool } from "@/features/tools/queries";
import { upsertPost } from "@/features/posts/queries";
import { isAuthorizedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Single write entry point for content (TechStack §6 / §8). Used by admin AND
 * automation bots — both authenticate with ADMIN_SECRET (cookie or Bearer).
 * Validates with Zod, upserts, then revalidates affected ISR paths.
 */
export async function POST(req: Request) {
  // Middleware already gates this, but re-check as defense in depth.
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contentEnvelopeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    if (parsed.data.kind === "tool") {
      const { slug } = await upsertTool(parsed.data.data);
      revalidatePath("/");
      revalidatePath("/full-list");
      revalidatePath(`/tools/${slug}`);
      return NextResponse.json({ ok: true, kind: "tool", slug }, { status: 200 });
    } else {
      const { slug } = await upsertPost(parsed.data.data);
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      return NextResponse.json({ ok: true, kind: "post", slug }, { status: 200 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
