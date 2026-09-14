import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description: `How ${SITE.name} uses affiliate links, in plain English (FTC-compliant).`,
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <div className="container max-w-2xl py-14">
      <h1 className="font-heading text-4xl font-bold tracking-tight">Affiliate Disclosure</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <div className="prose-review mt-8">
        <p>
          In the interest of full transparency (and in line with the U.S. Federal Trade Commission&apos;s
          endorsement guidelines), please assume the following about {SITE.name}:
        </p>
        <h2>We use affiliate links</h2>
        <p>
          Some of the outbound links on this site — typically the &ldquo;Visit&rdquo;,
          &ldquo;Get Deal&rdquo; and coupon buttons — are affiliate links. If you click one and sign
          up for or purchase a product, {SITE.name} may earn a commission. This comes at{" "}
          <strong>no extra cost to you</strong>; you pay the same price you would otherwise.
        </p>
        <h2>It does not change our opinion</h2>
        <p>
          Whether or not a tool has an affiliate program has no bearing on its rating, ranking, or
          whether we recommend it. We review tools on their merits. If we didn&apos;t like something,
          we say so — affiliate relationship or not.
        </p>
        <h2>How to spot an affiliate link</h2>
        <p>
          Every affiliate call-to-action on this site carries a short disclosure line right next to
          it. Affiliate links route through our own <code>/go/</code> redirect so they&apos;re easy to
          identify and maintain.
        </p>
        <h2>Questions?</h2>
        <p>
          If anything here is unclear, <Link href="/contact">get in touch</Link> — we&apos;re happy to
          explain.
        </p>
      </div>
    </div>
  );
}
