"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/types";

interface ChecklistRowProps {
  id: string;
  title: string;
  checked: boolean;
  onToggle: () => void;
  difficulty?: Difficulty;
  estimatedMinutes?: number;
  completionDate?: string;
  subtitle?: string;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

const diffVariant: Record<Difficulty, "success" | "warning" | "destructive"> = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
};

export function ChecklistRow({
  title,
  checked,
  onToggle,
  difficulty,
  estimatedMinutes,
  completionDate,
  subtitle,
}: ChecklistRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2.5 hover:border-zinc-700 transition-all">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${checked ? "line-through text-zinc-500" : "text-zinc-200"}`}>{title}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        {completionDate && checked && (
          <p className="text-xs text-emerald-500/70 mt-0.5">Completed {completionDate}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {difficulty && <Badge variant={diffVariant[difficulty]}>{difficulty}</Badge>}
        {estimatedMinutes && <span className="text-xs text-zinc-500">{estimatedMinutes}m</span>}
      </div>
    </div>
  );
}
