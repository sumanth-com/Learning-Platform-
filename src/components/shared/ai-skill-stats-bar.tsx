import type { AiSkillStats } from "@/components/shared/ai-skill-week-content";
import { cn } from "@/lib/utils";

interface AiSkillStatsBarProps {
  stats: AiSkillStats;
  inline?: boolean;
}

export function AiSkillStatsBar({ stats, inline = false }: AiSkillStatsBarProps) {
  if (inline) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <StatPill label="Topics" value={`${stats.topicsDone}/${stats.topicsTotal}`} />
        <StatPill label="Practice" value={`${stats.exercisesDone}/${stats.exercisesTotal}`} />
        <StatPill label="Overall" value={`${stats.doneItems}/${stats.totalItems}`} highlight />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <StatPill label="Topics" value={`${stats.topicsDone}/${stats.topicsTotal}`} block />
      <StatPill label="Practice" value={`${stats.exercisesDone}/${stats.exercisesTotal}`} block />
      <StatPill label="Overall" value={`${stats.doneItems}/${stats.totalItems}`} highlight block />
    </div>
  );
}

function StatPill({
  label,
  value,
  highlight,
  block,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  block?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-1.5",
        block && "px-4 py-2",
        highlight
          ? "border-indigo-500/25 bg-indigo-500/5"
          : "border-zinc-800 bg-zinc-900/60"
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p
        className={cn(
          "text-sm font-bold leading-tight tabular-nums",
          highlight ? "text-indigo-300" : "text-zinc-100"
        )}
      >
        {value}
      </p>
    </div>
  );
}
