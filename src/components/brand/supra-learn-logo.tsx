import Image from "next/image";
import logoMark from "@/assets/Logo.png";
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

interface SupraBaseLogoProps {
  size?: LogoSize;
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  /** Icon only — no wordmark */
  markOnly?: boolean;
}

/**
 * Brand mark — uses Logo.png for both themes.
 * The 30% radius clips the square corners baked into the source PNG.
 */
export function SupraBaseMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-[30%]",
        className
      )}
      aria-hidden
    >
      <Image
        src={logoMark}
        alt=""
        fill
        sizes="64px"
        priority
        className="object-cover"
      />
    </span>
  );
}

export function SupraBaseLogo({
  size = "sm",
  showText = true,
  showTagline = true,
  tagline = "Learn. Build. Ship.",
  className,
  markOnly = false,
}: SupraBaseLogoProps) {
  if (markOnly) {
    return <SupraBaseMark className={cn(MARK_SIZES[size], className)} />;
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <SupraBaseMark className={MARK_SIZES[size]} />
      {showText && (
        <div className="flex min-w-0 flex-col justify-center gap-1">
          <span
            className={cn(
              "font-semibold leading-none tracking-tight text-foreground",
              TITLE_SIZES[size]
            )}
          >
            Suprabase
          </span>
          {showTagline && (
            <span className="text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-muted-foreground">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
