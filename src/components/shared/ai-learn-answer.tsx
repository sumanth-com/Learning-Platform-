import { BookOpen, Lightbulb } from "lucide-react";
import type { AiLearnDetail } from "@/curriculum/ai-content/types";
import { cn } from "@/lib/utils";
import {
  LearnContentCard,
  learnCodeClass,
  learnPanelGridClass,
  learnProseClass,
} from "@/components/shared/learn-answer-cards";

interface AiLearnAnswerProps {
  title: string;
  detail: AiLearnDetail;
  className?: string;
  hideTitle?: boolean;
}

export function AiLearnAnswer({ title, detail, className, hideTitle }: AiLearnAnswerProps) {
  const widePrimary = Boolean(detail.code);

  return (
    <div
      className={cn(
        "grid h-full min-h-0 gap-2.5 overflow-x-hidden",
        learnPanelGridClass(widePrimary),
        className,
        !hideTitle && "grid-rows-[auto_1fr]"
      )}
    >
      {!hideTitle && (
        <h2 className="col-span-2 min-w-0 shrink-0 truncate text-sm font-semibold text-zinc-50 sm:text-base">
          {title}
        </h2>
      )}

      <LearnContentCard label="Answer" icon={BookOpen} accent="indigo">
        <p className={cn(learnProseClass, "whitespace-pre-wrap")}>{detail.answer}</p>
        {detail.code && (
          <pre className={learnCodeClass}>
            <code>{detail.code.trim()}</code>
          </pre>
        )}
      </LearnContentCard>

      <LearnContentCard label="Real-World Example" icon={Lightbulb} accent="amber">
        <p className={cn(learnProseClass, "whitespace-pre-wrap")}>{detail.realWorld}</p>
      </LearnContentCard>
    </div>
  );
}
