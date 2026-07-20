import { cn } from "@/lib/utils";

type LogoSize = "xs" | "sm" | "md" | "lg";

const MARK_SIZES: Record<LogoSize, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

const TITLE_SIZES: Record<LogoSize, string> = {
  xs: "text-sm",
  sm: "text-[1.125rem]",
  md: "text-xl",
  lg: "text-2xl",
};

interface SupraLearnLogoProps {
  size?: LogoSize;
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  /** Icon only — no wordmark */
  markOnly?: boolean;
}

export function SupraLearnMark({ className, id }: { className?: string; id?: string }) {
  const uid = id ?? "default";
  const ringId = `sl-ring-${uid}`;
  const coreId = `sl-core-${uid}`;
  const glowId = `sl-glow-${uid}`;

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={ringId} x1="6" y1="38" x2="38" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={coreId} x1="12" y1="32" x2="32" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312e81" />
          <stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="1" y="1" width="42" height="42" rx="13" stroke={`url(#${ringId})`} strokeWidth="1.5" fill="#09090b" />
      <rect x="4" y="4" width="36" height="36" rx="10" fill={`url(#${coreId})`} />
      <path
        d="M12 28.5C15 26.5 18 26.5 22 28.5C26 26.5 29 26.5 32 28.5V31C29 29 26 29 22 31C18 29 15 29 12 31V28.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path d="M22 28.5V31" stroke="#6366f1" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M14 26L22 14L30 26"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />
      <circle cx="22" cy="12.5" r="2.5" fill="#22d3ee" />
      <circle cx="22" cy="12.5" r="5" stroke="#22d3ee" strokeWidth="1" opacity="0.35" />
      <path
        d="M22 8.5V10M19.5 9.25L20.5 10.75M24.5 9.25L23.5 10.75"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function SupraLearnLogo({
  size = "sm",
  showText = true,
  showTagline = true,
  tagline = "Learn. Build. Ship.",
  className,
  markOnly = false,
}: SupraLearnLogoProps) {
  if (markOnly) {
    return <SupraLearnMark className={cn(MARK_SIZES[size], className)} />;
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <SupraLearnMark className={MARK_SIZES[size]} id={size} />
      {showText && (
        <div className="flex min-w-0 flex-col justify-center gap-1">
          <span
            className={cn(
              "font-semibold leading-none tracking-tight text-white",
              TITLE_SIZES[size]
            )}
          >
            SupraCodez
          </span>
          {showTagline && (
            <span className="text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-zinc-500">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
