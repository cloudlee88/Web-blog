import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date as e.g. "Jul 4, 2026". Returns "" for nullish input. */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Rough reading time in minutes from a markdown/plain string (~200 wpm). */
export function readingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Slugify an arbitrary string for URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Truncate to a max length on a word boundary, adding an ellipsis. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).trimEnd() + "…";
}
