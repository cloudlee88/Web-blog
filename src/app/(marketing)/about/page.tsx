import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Why ${SITE.name} exists: fewer tools, deeper reviews, honest verdicts.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-14">
      <h1 className="font-heading text-4xl font-bold tracking-tight">About {SITE.name}</h1>
      <div className="prose-review mt-8">
        <p>
          Most AI directories list thousands of tools with two lines of description each. Wide, but
          shallow — you still have to go research everything yourself before deciding.
        </p>
        <p>
          <strong>{SITE.name}</strong> takes the opposite bet. We review fewer tools, but each one
          properly: what it actually does, where it shines, where it falls short, what it costs, and
          who it&apos;s really for. Every tool here earns its spot.
        </p>
        <h2>How we review</h2>
        <p>
          We prioritise tools we&apos;ve actually used. When a review carries a{" "}
          <strong>Tested</strong> badge, it means we put the tool through real work — not just read
          its landing page. Our verdicts are opinions, not press releases.
        </p>
        <h2>How we make money</h2>
        <p>
          Some links on this site are affiliate links: if you sign up through them, we may earn a
          commission at no extra cost to you. This never changes our verdict or ranking — see our{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link> for the full policy.
        </p>
        <h2>Get in touch</h2>
        <p>
          Spotted something wrong, or want a tool reviewed?{" "}
          <Link href="/contact">Contact us</Link> — we read everything.
        </p>
      </div>
    </div>
  );
}
