import { Lock, ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { WeekProgressRing } from "@/components/shared/surface-card";
import { cn } from "@/lib/utils";

interface WeekSectionProps {
  weekId: number | string;
  title: string;
  subtitle?: string;
  progress?: number;
  locked?: boolean;
  badge?: React.ReactNode;
  sectionLabel?: string;
  /** Slimmer header without progress ring */
  compact?: boolean;
  /** Collapse / expand section content */
  collapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function WeekSection({
  weekId,
  title,
  subtitle,
  progress = 0,
  locked,
  badge,
  sectionLabel,
  compact,
  collapsible,
  isOpen = true,
  onToggle,
  className,
  children,
}: WeekSectionProps) {
  const label = sectionLabel ?? (typeof weekId === "number" ? `Week ${weekId}` : String(weekId).toUpperCase());

  if (compact) {
    const HeaderTag = collapsible ? "button" : "div";
    return (
      <section className={cn("space-y-4", className)}>
        <HeaderTag
          type={collapsible ? "button" : undefined}
          onClick={collapsible ? onToggle : undefined}
          className={cn(
            "flex w-full items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 text-left",
            collapsible && "transition-colors hover:border-zinc-700"
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {collapsible && (
                isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
                )
              )}
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                {label}
              </span>
              {locked && (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <Lock className="h-3 w-3" /> Locked
                </Badge>
              )}
              {badge}
            </div>
            <h2 className="mt-1 truncate text-sm font-medium text-zinc-200">{title}</h2>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
          {collapsible && typeof progress === "number" && !locked && (
            <span className="shrink-0 text-xs tabular-nums text-indigo-300">{progress}%</span>
          )}
        </HeaderTag>
        <AnimatePresence initial={false}>
          {(!collapsible || isOpen) && (
            <motion.div
              initial={collapsible ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={collapsible ? { height: 0, opacity: 0 } : undefined}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3 backdrop-blur-sm">
        <WeekProgressRing weekId={weekId} progress={progress} locked={locked}>
          {locked ? <Lock className="h-3.5 w-3.5 text-zinc-600" /> : undefined}
        </WeekProgressRing>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-400/80">
              {label}
            </span>
            {locked && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Lock className="h-3 w-3" /> Locked
              </Badge>
            )}
            {badge}
          </div>
          <h2 className="mt-0.5 truncate text-sm font-semibold text-zinc-100">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export { CardGrid, weekKey } from "@/components/shared/surface-card";
export { SurfaceCard } from "@/components/shared/surface-card";
