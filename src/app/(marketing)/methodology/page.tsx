import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Scale, Star, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "How We Review",
  description: `How ${SITE.name} tests and scores AI tools — our review process, scoring criteria and editorial independence.`,
  path: "/methodology",
});

const CRITERIA = [
  { label: "Capability", weight: "30%", note: "Does it actually do the job well, on real tasks?" },
  { label: "Ease of use", weight: "20%", note: "Onboarding, workflow friction, and learning curve." },
  { label: "Value for money", weight: "20%", note: "Pricing vs. what you get, including the free tier." },
  { label: "Reliability", weight: "15%", note: "Consistency, uptime and how it handles edge cases." },
  { label: "Support & docs", weight: "15%", note: "Help, documentation and how fast issues get solved." },
];

export default function MethodologyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="display-title text-4xl sm:text-5xl">How We Review</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        CloudPixel exists to give you an honest answer to one question:{" "}
        <em>should I use this?</em>{" "}
        Here&apos;s exactly how we get to that answer.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { icon: BadgeCheck, title: "We use the tools", body: "Reviews prioritise hands-on testing on real work. A “Tested” badge means we actually used it — not that we read the landing page." },
          { icon: Scale, title: "We score consistently", body: "Every tool is judged on the same weighted criteria, so scores are comparable across reviews." },
          { icon: Star, title: "We stay honest", body: "We name the downsides. If we wouldn't recommend something, we say so — affiliate relationship or not." },
          { icon: ShieldCheck, title: "We're independent", body: "Whether a tool has an affiliate program never changes its score, ranking or verdict." },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-5">
            <c.icon className="size-6 text-primary" />
            <h2 className="mt-3 font-heading text-lg font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="prose-review mt-12">
        <h2>Our scoring criteria</h2>
        <p>Each review is scored out of 5 using five weighted factors:</p>
        <table>
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Weight</th>
              <th>What we look at</th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.label}>
                <td>
                  <strong>{c.label}</strong>
                </td>
                <td>{c.weight}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Editorial rank vs. rating</h2>
        <p>
          The <strong>rating</strong> is the tool&apos;s score out of 5. The{" "}
          <strong>editorial rank</strong> is our hand-set position when several tools score similarly
          — it reflects who we&apos;d recommend first for the typical reader. We do not run public
          upvotes; rankings are editorial, plus a “trending” signal from anonymous click data.
        </p>

        <h2>Affiliate relationships</h2>
        <p>
          Some links are affiliate links, and we may earn a commission if you sign up through them —
          at no extra cost to you. This never influences a verdict. Read the full{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
        </p>

        <h2>Corrections</h2>
        <p>
          Tools change fast. Every review shows a “Last updated” date, and we revise as products
          evolve. Spot something out of date?{" "}
          <Link href="/contact">Tell us</Link> and we&apos;ll fix it.
        </p>
      </div>
    </div>
  );
}
