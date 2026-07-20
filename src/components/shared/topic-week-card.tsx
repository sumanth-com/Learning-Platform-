import Link from "next/link";
import { Lock, LockOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SurfaceCard, type SurfaceCardVariant } from "@/components/shared/surface-card";
import { Progress } from "@/components/ui/progress";

type TopicWeekCardAccent = "indigo" | "purple" | "emerald" | "sky";

const accentStyles: Record<
  TopicWeekCardAccent,
  { iconBg: string; iconRing: string; iconColor: string; progress: string; cta: string }
> = {
  indigo: {
    iconBg: "from-indigo-500/20 via-indigo-500/10 to-purple-500/5",
    iconRing: "ring-indigo-500/25",
    iconColor: "text-indigo-300",
    progress: "from-indigo-500 via-violet-500 to-indigo-400",
    cta: "bg-indigo-500/10 text-indigo-200 ring-indigo-500/25 hover:bg-indigo-500/15",
  },
  purple: {
    iconBg: "from-purple-500/20 via-fuchsia-500/10 to-indigo-500/5",
    iconRing: "ring-purple-500/25",
    iconColor: "text-purple-300",
    progress: "from-purple-500 via-fuchsia-500 to-indigo-400",
    cta: "bg-purple-500/10 text-purple-200 ring-purple-500/25 hover:bg-purple-500/15",
  },
  emerald: {
    iconBg: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5",
    iconRing: "ring-emerald-500/25",
    iconColor: "text-emerald-300",
    progress: "from-emerald-500 via-teal-500 to-cyan-400",
    cta: "bg-emerald-500/10 text-emerald-200 ring-emerald-500/25 hover:bg-emerald-500/15",
  },
  sky: {
    iconBg: "from-sky-500/20 via-blue-500/10 to-indigo-500/5",
    iconRing: "ring-sky-500/25",
    iconColor: "text-sky-300",
    progress: "from-sky-500 via-blue-500 to-indigo-400",
    cta: "bg-sky-500/10 text-sky-200 ring-sky-500/25 hover:bg-sky-500/15",
  },
};

export interface TopicWeekCardProps {
  weekLabel: string;
  title: string;
  subtitle?: string;
  progress: number;
  progressDetail: string;
  trailing?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  ctaLabel?: string;
  accent?: TopicWeekCardAccent;
  variant?: SurfaceCardVariant;
  locked?: boolean;
  complete?: boolean;
  className?: string;
}

function resolveCtaLabel(locked: boolean, complete: boolean, progress: number, override?: string) {
  if (override) return override;
  if (locked) return "Locked";
  if (complete) return "Review";
  if (progress > 0) return "Continue";
  return "Open";
}

export function TopicWeekCard({
  weekLabel,
  title,
  subtitle = "",
  progress,
  progressDetail,
  trailing,
  footer,
  href,
  ctaLabel,
  accent = "indigo",
  variant = "default",
  locked = false,
  complete = false,
  className,
}: TopicWeekCardProps) {
  const styles = accentStyles[accent];
  const pct = Math.min(Math.max(progress, 0), 100);
  const label = resolveCtaLabel(locked, complete, pct, ctaLabel);
  const showCta = !footer;

  const ctaClasses = cn(
    "mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ring-1 transition-colors",
    locked
      ? "cursor-not-allowed bg-zinc-900/40 text-zinc-600 ring-zinc-800/80"
      : complete
        ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25 hover:bg-emerald-500/15"
        : styles.cta
  );

  const ctaContent = (
    <>
      {label}
      {!locked && <ArrowRight className="h-3.5 w-3.5" />}
    </>
  );

  return (
    <SurfaceCard
      variant={variant}
      className={cn("min-h-[220px] p-5 sm:p-[1.35rem]", className)}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.12em]",
              locked ? "text-zinc-600" : "text-zinc-400"
            )}
          >
            {weekLabel}
          </span>

          {trailing ?? (
            <div
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1",
                styles.iconBg,
                styles.iconRing,
                locked && "opacity-70 saturate-50"
              )}
            >
              {locked ? (
                <Lock className="h-4 w-4 text-zinc-500" />
              ) : complete ? (
                <CheckCircle2 className={cn("h-4 w-4", styles.iconColor)} />
              ) : (
                <LockOpen className={cn("h-4 w-4", styles.iconColor)} strokeWidth={2} />
              )}
            </div>
          )}
        </div>

        <h3
          className={cn(
            "mt-4 line-clamp-2 text-left text-[17px] font-bold leading-[1.25] tracking-tight sm:text-lg",
            locked ? "text-zinc-500" : "text-zinc-50"
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "mt-2.5 line-clamp-2 min-h-[2.75rem] flex-1 text-left text-[13px] leading-[1.55]",
            locked ? "text-zinc-600" : "text-zinc-400/90"
          )}
        >
          {subtitle}
        </p>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className={cn("truncate", locked ? "text-zinc-600" : "text-zinc-500")}>
              {progressDetail}
            </span>
            <span
              className={cn(
                "shrink-0 tabular-nums font-semibold",
                complete ? "text-emerald-400" : locked ? "text-zinc-600" : "text-zinc-300"
              )}
            >
              {pct}%
            </span>
          </div>
          <Progress
            value={pct}
            className={cn("h-[5px] bg-zinc-800/90", locked && "opacity-50")}
            indicatorClassName={cn(
              "bg-gradient-to-r",
              complete ? "from-emerald-500 via-teal-500 to-emerald-400" : styles.progress
            )}
          />
        </div>

        {showCta &&
          (href && !locked ? (
            <Link href={href} className={ctaClasses}>
              {ctaContent}
            </Link>
          ) : (
            <span className={ctaClasses}>{ctaContent}</span>
          ))}

        {footer}
      </div>
    </SurfaceCard>
  );
}
