"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { newsletterSchema } from "@/schemas/content";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { z } from "zod";

type FormValues = z.infer<typeof newsletterSchema>;

/** Inline newsletter form (FR-8.1). Posts to /api/newsletter (ESP proxy). */
export function NewsletterForm({
  source = "inline",
  className,
}: {
  source?: string;
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { source },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      track.newsletterSubmit(source);
    } catch (err) {
      setError("email", {
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  if (isSubmitSuccessful) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800",
          className,
        )}
      >
        <CheckCircle2 className="size-5 shrink-0" />
        <p className="text-sm font-medium">You&apos;re in! Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-2", className)} noValidate>
      <input type="hidden" {...register("source")} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="you@example.com"
            aria-label="Email address"
            aria-invalid={!!errors.email}
            {...register("email")}
            className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-gradient inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-navy-foreground disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Subscribe
        </button>
      </div>
      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
    </form>
  );
}
