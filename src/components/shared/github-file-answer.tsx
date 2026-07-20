import type { GitHubFileDetail } from "@/curriculum/github-content/types";
import { cn } from "@/lib/utils";
import { learnCodeClass, learnProseClass } from "@/components/shared/learn-answer-cards";

interface GitHubFileAnswerProps {
  detail: GitHubFileDetail;
  className?: string;
}

export function GitHubFileAnswer({ detail, className }: GitHubFileAnswerProps) {
  return (
    <div
      className={cn(
        "min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain",
        className
      )}
    >
      <section className="space-y-3 pb-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          What to Build
        </h3>
        <p className={cn(learnProseClass, "leading-[1.75] text-zinc-300/95")}>{detail.answer}</p>
        {detail.code && (
          <pre className="rounded-md border border-zinc-800/70 bg-zinc-950/90 px-4 py-3">
            <code className={cn(learnCodeClass, "mt-0 text-[11px] sm:text-xs")}>
              {detail.code.trim()}
            </code>
          </pre>
        )}
      </section>

      <section className="space-y-3 border-t border-zinc-800/50 pt-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Compile, Run & Push
        </h3>
        <p className={cn(learnProseClass, "whitespace-pre-wrap leading-[1.75] text-zinc-300/95")}>
          {detail.realWorld}
        </p>
      </section>
    </div>
  );
}
