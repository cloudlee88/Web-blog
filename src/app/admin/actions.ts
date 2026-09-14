"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, isAdmin, safeEqual } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export interface LoginState {
  error?: string;
}

/** Log in: compare the submitted secret and set the httpOnly admin cookie. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const secret = process.env.ADMIN_SECRET;
  const input = String(formData.get("secret") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!secret) return { error: "ADMIN_SECRET is not configured on the server." };
  if (!input || !safeEqual(input, secret)) return { error: "Incorrect secret." };

  cookies().set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout(): Promise<void> {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function assertAdmin() {
  if (!isAdmin()) throw new Error("Unauthorized");
}

/** Create/update an affiliate link (the /go/[slug] target). FR-6.1 */
export async function upsertAffiliateLink(formData: FormData): Promise<void> {
  assertAdmin();
  const slug = slugify(String(formData.get("slug") ?? ""));
  const targetUrl = String(formData.get("targetUrl") ?? "").trim();
  const network = String(formData.get("network") ?? "").trim() || null;
  const couponCode = String(formData.get("couponCode") ?? "").trim() || null;
  const active = formData.get("active") === "on";

  if (!slug || !targetUrl) throw new Error("Slug and target URL are required.");

  await prisma.affiliateLink.upsert({
    where: { slug },
    create: { slug, targetUrl, network, couponCode, active },
    update: { targetUrl, network, couponCode, active },
  });

  revalidatePath("/admin");
}

export async function deleteAffiliateLink(formData: FormData): Promise<void> {
  assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (slug) await prisma.affiliateLink.delete({ where: { slug } }).catch(() => null);
  revalidatePath("/admin");
}

export async function deleteTool(formData: FormData): Promise<void> {
  assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (slug) await prisma.tool.delete({ where: { slug } }).catch(() => null);
  revalidatePath("/admin");
  revalidatePath("/full-list");
}
