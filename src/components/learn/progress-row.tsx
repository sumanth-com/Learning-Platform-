"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressRowProps = {
  label: string;
  value: number;
  meta?: string;
  className?: string;
};

export function ProgressRow({
  label,
  value,
  meta,
  className,
}: ProgressRowProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-zinc-400">{label}</span>
        <span className="tabular-nums text-zinc-500">
          {meta ?? `${value}%`}
        </span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}
