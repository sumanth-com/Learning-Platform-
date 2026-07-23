import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FilterPillsProps {
  options: { id: string | number; label: string }[];
  value: string | number;
  onChange: (id: string | number) => void;
  className?: string;
  scrollable?: boolean;
}

export function FilterGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", className)}>
      <span className="w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:w-16 sm:text-xs">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function FilterPills({ options, value, onChange, className, scrollable = false }: FilterPillsProps) {
  return (
    <div
      className={cn(
        scrollable
          ? "flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-wrap gap-2",
        className
      )}
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={String(opt.id)}
            onClick={() => onChange(opt.id)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
              active
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-1 ring-indigo-500/40"
                : "bg-zinc-900/70 text-zinc-400 ring-1 ring-zinc-800/80 hover:bg-zinc-800/70 hover:text-zinc-200"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** LeetCode / HackerRank style segmented difficulty tabs */
export function DifficultyTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-card p-0.5",
        className
      )}
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors",
              active
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Compact dropdown filter */
export function FilterSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  compact = false,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  className?: string;
  /** Size to content instead of stretching full width */
  compact?: boolean;
}) {
  const hasPlaceholder = placeholder != null && placeholder !== "" && (value === "" || value === undefined);
  return (
    <div
      className={cn(
        "relative inline-flex items-stretch",
        compact ? "w-auto" : "w-full max-w-full",
        className
      )}
    >
      <select
        value={String(value ?? "")}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find((o) => String(o.value) === raw);
          if (match) onChange(match.value);
        }}
        aria-label={label}
        className={cn(
          "h-8 cursor-pointer appearance-none rounded-lg border border-border bg-card py-0 pl-3 pr-7 text-xs font-medium text-foreground outline-none transition-colors hover:border-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
          compact ? "w-full" : "w-full min-w-0",
          hasPlaceholder && "text-muted-foreground"
        )}
      >
        {placeholder != null && placeholder !== "" && (
          <option value="" className="bg-card text-muted-foreground">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={String(opt.value)}
            value={String(opt.value)}
            className="bg-card text-foreground"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex w-7 items-center justify-center border-l border-border">
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
    </div>
  );
}
