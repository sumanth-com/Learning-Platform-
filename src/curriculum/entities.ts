import type { CurriculumWeekDefinition, TrackableEntity } from "./types";
import { getLearningWeek, lessonEntityId } from "@/learning-engine/loader";

/** Collect every trackable entity ID from a week definition */
export function collectTrackableEntities(week: CurriculumWeekDefinition): TrackableEntity[] {
  const entities: TrackableEntity[] = [];
  const { id: weekId } = week;

  week.days.forEach((day) => {
    day.topics.forEach((topic) => {
      topic.items.forEach((item) => {
        entities.push({
          id: item.id,
          weekId,
          type: "day-item",
          label: item.title,
          difficulty: item.difficulty ?? topic.difficulty,
          category: topic.title,
        });
      });
    });
  });

  week.programmingQuestions.forEach((cat) => {
    cat.questions.forEach((q) => {
      entities.push({
        id: q.id,
        weekId,
        type: "programming-question",
        label: q.title,
        difficulty: q.difficulty,
        category: cat.category,
      });
    });
  });

  week.projects.forEach((project) => {
    project.features.forEach((feat) => {
      entities.push({
        id: feat.id,
        weekId,
        type: "project-feature",
        label: feat.title,
        category: project.title,
      });
    });
    entities.push({
      id: `${project.id}-complete`,
      weekId,
      type: "project-complete",
      label: `${project.title} (Complete)`,
      category: project.title,
    });
  });

  week.aiSkill.learningTopics.forEach((t) => {
    entities.push({ id: t.id, weekId, type: "ai-topic", label: t.title });
  });
  week.aiSkill.exercises.forEach((e) => {
    entities.push({ id: e.id, weekId, type: "ai-exercise", label: e.title });
  });
  (week.aiSkill.promptExercises ?? []).forEach((p) => {
    entities.push({ id: p.id, weekId, type: "ai-prompt", label: p.prompt });
  });

  week.githubTasks.files.forEach((f) => {
    entities.push({
      id: f.id,
      weekId,
      type: "github-file",
      label: f.path,
      category: week.githubTasks.repository,
    });
  });

  week.interviewQuestions.forEach((cat) => {
    cat.questions.forEach((q) => {
      entities.push({
        id: q.id,
        weekId,
        type: "interview-question",
        label: q.question,
        category: cat.category,
      });
    });
  });

  // Learning engine lessons (roadmap week topics)
  const learnWeek = getLearningWeek(weekId);
  if (learnWeek) {
    for (const tb of learnWeek.topics) {
      for (const lesson of tb.lessons) {
        entities.push({
          id: lessonEntityId(lesson),
          weekId,
          type: "learning-lesson",
          label: lesson.title,
          difficulty: lesson.difficulty,
          category: lesson.category,
        });
      }
    }
  }

  return entities;
}

export function collectAllTrackableEntities(weeks: CurriculumWeekDefinition[]): TrackableEntity[] {
  return weeks.flatMap(collectTrackableEntities);
}

export function getEntityIdsByType(
  weeks: CurriculumWeekDefinition[],
  weekId: number,
  type: TrackableEntity["type"]
): string[] {
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return [];
  return collectTrackableEntities(week)
    .filter((e) => e.type === type)
    .map((e) => e.id);
}
