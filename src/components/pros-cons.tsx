import { Check, X } from "lucide-react";

/** Two contrasting blocks for the review (PDR §4.3). */
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold text-emerald-800">
          <Check className="size-5" /> Pros
        </h3>
        <ul className="space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold text-rose-800">
          <X className="size-5" /> Cons
        </h3>
        <ul className="space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <X className="mt-0.5 size-4 shrink-0 text-rose-500" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
