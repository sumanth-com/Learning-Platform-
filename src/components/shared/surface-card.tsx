import { cn } from "@/lib/utils";

export type SurfaceCardVariant = "default" | "active" | "success" | "locked";

const accent: Record<SurfaceCardVariant, string> = {
  default: "from-indigo-500/50 via-purple-500/30 to-transparent",
  active: "from-indigo-400 via-purple-400 to-blue-400",
  success: "from-emerald-400 via-teal-400 to-transparent",
  locked: "from-zinc-600/40 to-transparent",
};

const shell: Record<SurfaceCardVariant, string> = {
  default:
    "border-zinc-800/70 bg-zinc-900/55 hover:border-indigo-500/35 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-indigo-500/[0.07] hover:-translate-y-0.5",
  active:
    "border-indigo-500/45 bg-gradient-to-br from-indigo-950/35 via-zinc-900/60 to-purple-950/25 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/20",
  success:
    "border-emerald-500/30 bg-gradient-to-br from-emerald-950/15 via-zinc-900/55 to-zinc-900/60 hover:border-emerald-500/40",
  locked: "border-zinc-800/40 bg-zinc-950/40 opacity-60 saturate-50",
};

interface SurfaceCardProps {
  variant?: SurfaceCardVariant;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "button" | "article";
  onClick?: () => void;
  disabled?: boolean;
}

export function SurfaceCard({
  variant = "default",
  className,
  children,
  as: Tag = "div",
  onClick,
  disabled,
}: SurfaceCardProps) {
  return (
    <Tag
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300",
        shell[variant],
        Tag === "button" && "cursor-pointer text-left",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-80",
          accent[variant]
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300",
          variant === "active" && "bg-indigo-500/20 opacity-100",
          variant === "success" && "bg-emerald-500/15 opacity-100",
          variant === "default" && "bg-indigo-500/10 opacity-0 group-hover:opacity-100",
          variant === "locked" && "opacity-0"
        )}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  );
}

interface WeekProgressRingProps {
  weekId: number | string;
  progress: number;
  locked?: boolean;
  done?: boolean;
  children?: React.ReactNode;
}

export function WeekProgressRing({ weekId, progress, locked, done, children }: WeekProgressRingProps) {
  const size = 44;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-zinc-800"
        />
        {!locked && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={done ? "#34d399" : "url(#weekRingGrad)"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        )}
        <defs>
          <linearGradient id="weekRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              locked ? "text-zinc-600" : done ? "text-emerald-400" : "text-indigo-300"
            )}
          >
            {weekId}
          </span>
        )}
      </div>
    </div>
  );
}

export function CardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

/** Unique key when the same id appears across multiple weeks */
export function weekKey(weekId: number | string, id: string) {
  return `w${weekId}-${id}`;
}
