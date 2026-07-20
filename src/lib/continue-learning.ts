import { getLearningWeek } from "@/learning-engine/loader";
import { lessonEntityId, type LearnLesson } from "@/learning-engine/types";
import type { ResumePosition } from "@/lib/module-progress";

export function findContinueLesson(weekId: number, isDone: (id: string) => boolean) {
  const week = getLearningWeek(weekId);
  if (!week) return null;

  for (const bundle of week.topics) {
    for (const lesson of bundle.lessons) {
      if (lesson.problemType === "mcq") continue;
      if (lesson.weekId && lesson.weekId !== week.weekId) continue;
      const id = lessonEntityId({
        weekId,
        topicSlug: bundle.topic.slug,
        id: lesson.id,
      });
      if (!isDone(id)) {
        return {
          weekId,
          topicSlug: bundle.topic.slug,
          topicTitle: bundle.topic.title,
          lesson: lesson as LearnLesson & { topicSlug: string },
        };
      }
    }
  }
  return null;
}

export function learnUrl(
  weekId: number,
  topicSlug: string,
  lesson: Pick<LearnLesson, "id" | "difficulty" | "problemType">
) {
  const params = new URLSearchParams({
    topic: topicSlug,
    lesson: lesson.id,
    difficulty: lesson.difficulty,
  });
  if (lesson.problemType) params.set("type", lesson.problemType);
  return `/roadmap/week/${weekId}/learn?${params.toString()}`;
}

export interface ContinueLearningTarget {
  href: string;
  weekId: number;
  weekLabel: string;
  topicLabel: string;
  challengeLabel: string;
  bannerLine: string;
}

export function buildContinueLearningTarget(
  practiceWeekId: number,
  isDone: (id: string) => boolean,
  resume: ResumePosition | null,
  weekTitle?: string
): ContinueLearningTarget {
  const resumeValid = resume && resume.weekId >= practiceWeekId;
  const continueLesson = findContinueLesson(practiceWeekId, isDone);

  if (resumeValid && resume.href) {
    return {
      href: resume.href,
      weekId: resume.weekId,
      weekLabel: `Week ${resume.weekId}`,
      topicLabel: resume.topicTitle ?? resume.title.split("·").pop()?.trim() ?? weekTitle ?? "Open your week",
      challengeLabel:
        resume.lessonTitle ?? resume.subtitle?.split("·")[0]?.trim() ?? "Continue where you left off",
      bannerLine: `Continue Learning · ${resume.title}${resume.subtitle ? ` · ${resume.subtitle}` : ""}`,
    };
  }

  if (continueLesson) {
    const href = learnUrl(continueLesson.weekId, continueLesson.topicSlug, continueLesson.lesson);
    const weekLabel = weekTitle ?? `Week ${practiceWeekId}`;
    return {
      href,
      weekId: practiceWeekId,
      weekLabel: `Week ${practiceWeekId}`,
      topicLabel: continueLesson.topicTitle,
      challengeLabel: continueLesson.lesson.title,
      bannerLine: `Week ${practiceWeekId} · ${weekLabel} · ${continueLesson.topicTitle} · ${continueLesson.lesson.title}`,
    };
  }

  return {
    href: `/roadmap/week/${practiceWeekId}`,
    weekId: practiceWeekId,
    weekLabel: `Week ${practiceWeekId}`,
    topicLabel: weekTitle ?? "Open your week",
    challengeLabel: "Start this week's challenges",
    bannerLine: weekTitle ? `Week ${practiceWeekId} · ${weekTitle}` : `Week ${practiceWeekId}`,
  };
}
