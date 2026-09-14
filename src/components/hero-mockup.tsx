import {
  LayoutDashboard,
  Star,
  Users,
  Trophy,
  ListChecks,
  TrendingUp,
  Play,
  Bell,
  Plus,
  ArrowUpRight,
  ChevronDown,
  BadgeCheck,
} from "lucide-react";

/** Green "growth" delta pill (spec §3 — bg #DCFCE7 / text #16A34A). */
function Delta({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[11px] font-semibold text-[#16A34A]">
      <ArrowUpRight className="size-3" />
      {value}
    </span>
  );
}

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BadgeCheck, label: "Reviews", badge: "New" },
  { icon: Trophy, label: "Rankings" },
  { icon: ListChecks, label: "Guides" },
  { icon: TrendingUp, label: "Trending" },
  { icon: Users, label: "Readers" },
];

const METRICS = [
  { icon: BadgeCheck, label: "Tools reviewed", value: "42", delta: "12%" },
  { icon: Star, label: "Avg. score", value: "4.6", delta: "3%" },
  { icon: Users, label: "Readers / mo", value: "128k", delta: "8%" },
];

/**
 * Illustrative editorial-dashboard mockup for the hero (Trackit-cloud spec §3):
 * big rounded card, soft wide shadow, sidebar, metric cards with delta pills,
 * a floating navy play button, and a performance chart. Decorative.
 */
export function HeroMockup() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[20px] border border-border bg-card text-left shadow-[0_28px_70px_-24px_rgba(16,24,40,0.32)]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-navy text-navy-foreground">
            <span className="text-[11px] font-bold">C</span>
          </span>
          <span className="text-sm font-semibold">Dashboard</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-navy-foreground sm:inline-flex">
            <Plus className="size-3.5" /> Add review
          </span>
          <Bell className="size-4 text-muted-foreground" />
          <span className="size-6 rounded-full bg-gradient-to-br from-primary to-brand-2" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-border p-3 lg:block">
          <nav className="space-y-1">
            {NAV.map((n) => (
              <div
                key={n.label}
                className={
                  n.active
                    ? "flex items-center gap-2.5 rounded-lg bg-[#EFF4FE] px-3 py-2 text-sm font-semibold text-navy"
                    : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground"
                }
              >
                <n.icon className={n.active ? "size-4 text-primary" : "size-4"} />
                <span className="flex-1">{n.label}</span>
                {n.badge && (
                  <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                    {n.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="relative flex-1 space-y-4 p-4 sm:p-5">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-xl border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <m.icon className="size-3.5" />
                  <span className="truncate text-[11px]">{m.label}</span>
                </div>
                <div className="mt-2 flex items-end justify-between gap-1">
                  <span className="font-heading text-2xl font-bold leading-none">{m.value}</span>
                  <Delta value={m.delta} />
                </div>
              </div>
            ))}
          </div>

          {/* Floating play button */}
          <span className="absolute left-1/2 top-[42%] z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-navy-foreground shadow-[0_10px_24px_rgba(16,24,40,0.35)] ring-4 ring-white/70">
            <Play className="size-5 translate-x-0.5 fill-current" />
          </span>

          {/* Lower cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Performance overview */}
            <div className="rounded-xl border border-border p-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Performance overview</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  Last 30 days <ChevronDown className="size-3" />
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-heading text-xl font-bold">128,420</span>
                <Delta value="8%" />
              </div>
              <svg viewBox="0 0 300 80" className="mt-2 h-16 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,64 C28,56 44,34 68,40 C96,47 108,16 140,26 C176,37 190,52 222,32 C252,14 270,20 300,14 L300,80 L0,80 Z"
                  fill="url(#mk-area)"
                />
                <path
                  d="M0,64 C28,56 44,34 68,40 C96,47 108,16 140,26 C176,37 190,52 222,32 C252,14 270,20 300,14"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Top rated */}
            <div className="rounded-xl border border-border p-3">
              <span className="text-xs font-semibold">Top rated</span>
              <ul className="mt-2 space-y-2">
                {[
                  { n: "ChatGPT", s: "4.7" },
                  { n: "Claude", s: "4.6" },
                  { n: "Perplexity", s: "4.5" },
                ].map((t, i) => (
                  <li key={t.n} className="flex items-center gap-2 text-xs">
                    <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium">{t.n}</span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-navy">
                      <Star className="size-3 fill-gold text-gold" />
                      {t.s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
