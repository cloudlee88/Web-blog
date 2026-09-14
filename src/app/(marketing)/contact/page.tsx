import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${SITE.name} team.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-14">
      <h1 className="font-heading text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Suggest a tool, report a mistake, or ask about a partnership. We read every message.
      </p>

      <a
        href={`mailto:${SITE.email}`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 font-medium transition-colors hover:bg-accent"
      >
        <Mail className="size-5 text-primary" />
        {SITE.email}
      </a>

      <div className="mt-12 rounded-2xl border border-border bg-accent/40 p-8">
        <h2 className="font-heading text-xl font-bold">Prefer to just follow along?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join the newsletter for the occasional honest tool review.
        </p>
        <div className="mt-4">
          <NewsletterForm source="contact" />
        </div>
      </div>
    </div>
  );
}
