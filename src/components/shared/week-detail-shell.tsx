import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WeekDetailShellProps {
  backHref: string;
  title: string;
  progressPct: number;
  complete?: boolean;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  weekId?: number;
  badgeLabel?: string;
  flush?: boolean;
}

export function WeekDetailShell({
  backHref,
  weekId,
  badgeLabel,
  title,
  progressPct,
  complete,
  headerExtra,
  children,
  flush = false,
}: WeekDetailShellProps) {
  const badge = badgeLabel ?? (weekId != null ? `Week ${weekId}` : undefined);

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-zinc-950 lg:left-64">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-2.5">
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {badge && (
            <Badge variant="purple" className="text-[10px]">
              {badge}
            </Badge>
          )}
          <h1 className="hidden max-w-[160px] truncate text-sm font-semibold text-zinc-50 sm:block lg:max-w-[240px]">
            {title}
          </h1>
          {complete && (
            <Badge variant="success" className="hidden text-[10px] sm:inline-flex">
              Done
            </Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
          <Progress value={progressPct} className="h-1.5 flex-1" />
          <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-indigo-300">
            {progressPct}%
          </span>
        </div>

        {headerExtra}
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          !flush && "p-3 sm:p-4"
        )}
      >
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
