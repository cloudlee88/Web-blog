import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Admin sign in", noIndex: true });

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <div className="container flex max-w-sm flex-col justify-center py-24">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the admin secret to manage tools and content.
        </p>
        <div className="mt-6">
          <LoginForm from={searchParams.from ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
