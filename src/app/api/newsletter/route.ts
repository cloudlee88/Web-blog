import { NextResponse } from "next/server";
import { newsletterSchema } from "@/schemas/content";
import { addSubscriberToEsp } from "@/lib/email";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Newsletter signup (FR-8.1): store a DB backup + push to the ESP. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
  }

  const email = parsed.data.email.toLowerCase();

  // Best-effort DB backup (source of truth is the ESP). Don't fail if DB is down.
  try {
    await prisma.subscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });
  } catch {
    /* ignore — ESP below is the primary store */
  }

  const esp = await addSubscriberToEsp(email);
  if (!esp.ok) {
    return NextResponse.json(
      { error: "We couldn't complete your signup. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
