import Link from "next/link";
import type { Metadata } from "next";
import { LinkIcon } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Link unavailable", noIndex: true });

export default function LinkUnavailablePage() {
  return (
    <div className="container flex max-w-md flex-col items-center py-24 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <LinkIcon className="size-7" />
      </div>
      <h1 className="font-heading text-2xl font-bold">This link isn&apos;t available</h1>
      <p className="mt-2 text-muted-foreground">
        The deal or affiliate link you followed has expired or moved. It happens — programs change
        their terms. Browse our current picks instead.
      </p>
      <Link
        href="/full-list"
        className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
      >
        Browse all tools
      </Link>
    </div>
  );
}
