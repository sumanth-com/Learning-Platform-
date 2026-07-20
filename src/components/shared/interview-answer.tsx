import { BookOpen, Lightbulb } from "lucide-react";
import type { CurriculumInterviewQuestion } from "@/curriculum/types";
import { cn } from "@/lib/utils";
import {
  LearnContentCard,
  learnCodeClass,
  learnOutputClass,
  learnPanelGridClass,
  learnProseClass,
} from "@/components/shared/learn-answer-cards";

interface InterviewAnswerProps {
  question: CurriculumInterviewQuestion;
  className?: string;
  hideTitle?: boolean;
}

export function InterviewAnswer({ question, className, hideTitle }: InterviewAnswerProps) {
  const widePrimary = Boolean(question.code || question.output);

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
          {question.question}
        </h2>
      )}

      <LearnContentCard label="Interview Answer" icon={BookOpen} accent="indigo">
        <p className={learnProseClass}>{question.answer}</p>
        {question.code && (
          <pre className={learnCodeClass}>
            <code>{question.code.trim()}</code>
          </pre>
        )}
        {question.output && (
          <pre className={learnOutputClass}>
            <code>{question.output.trim()}</code>
          </pre>
        )}
      </LearnContentCard>

      <LearnContentCard label="Real-World Example" icon={Lightbulb} accent="amber">
        <p className={learnProseClass}>
          {question.realWorld ??
            "Keep your answer concise: definition, one example, and when you used it in a project."}
        </p>
      </LearnContentCard>
    </div>
  );
}
