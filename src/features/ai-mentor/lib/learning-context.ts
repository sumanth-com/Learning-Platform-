import type { LearningContext } from "@/features/ai-mentor/types";

export function formatLearningContextSummary(
  ctx: LearningContext | null | undefined
): string | null {
  if (!ctx) return null;
  const bits = [
    ctx.moduleTitle,
    ctx.topicTitle,
    ctx.lessonTitle,
    ctx.assignmentTitle,
    ctx.projectTitle,
  ].filter(Boolean);
  if (!bits.length && !ctx.progressSummary) return null;
  return [bits.join(" · "), ctx.progressSummary].filter(Boolean).join(" — ");
}

export function mergeLearningContext(
  base?: LearningContext | null,
  extra?: LearningContext | null
): LearningContext {
  return { ...(base ?? {}), ...(extra ?? {}) };
}
