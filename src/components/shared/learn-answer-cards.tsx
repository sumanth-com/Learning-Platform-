import { BookOpen, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function learnPanelGridClass(widePrimary = false) {
  return widePrimary
    ? "grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]"
    : "grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]";
}

export const learnCardBodyClass =
  "min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain break-words px-3 py-2.5";

export const learnProseClass = "text-[13px] leading-[1.6] break-words text-zinc-300 sm:text-sm";

export const learnCodeClass =
  "mt-2 whitespace-pre-wrap break-words text-[10px] leading-relaxed text-emerald-300/90 [overflow-wrap:anywhere] sm:text-[11px]";

export const learnOutputClass =
  "mt-2 whitespace-pre-wrap break-words text-[10px] leading-relaxed text-zinc-400 [overflow-wrap:anywhere] sm:text-[11px]";

const accentStyles = {
  indigo: {
    bar: "bg-indigo-500/[0.07] border-zinc-800/60",
    label: "text-indigo-400",
    icon: "text-indigo-400",
  },
  amber: {
    bar: "bg-amber-500/[0.07] border-zinc-800/60",
    label: "text-amber-400/95",
    icon: "text-amber-400/95",
  },
} as const;

export function LearnContentCard({
  label,
  icon: Icon = BookOpen,
  accent,
  className,
  children,
}: {
  label: string;
  icon?: typeof BookOpen | typeof Lightbulb;
  accent: keyof typeof accentStyles;
  className?: string;
  children: React.ReactNode;
}) {
  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/50",
        className
      )}
    >
      <div className={`flex shrink-0 items-center gap-2 border-b px-3 py-1.5 ${styles.bar}`}>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${styles.icon}`} />
        <p className={`text-[10px] font-semibold uppercase tracking-wider ${styles.label}`}>
          {label}
        </p>
      </div>
      <div className={learnCardBodyClass}>{children}</div>
    </div>
  );
}
