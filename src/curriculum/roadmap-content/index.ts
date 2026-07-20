import type { CurriculumWeekDefinition } from "@/curriculum/types";
import type { AiLearnDetail } from "@/curriculum/ai-content/types";

interface ItemContext {
  day: CurriculumWeekDefinition["days"][number];
  topic: CurriculumWeekDefinition["days"][number]["topics"][number];
}

function findItemContext(week: CurriculumWeekDefinition, id: string): ItemContext | null {
  for (const day of week.days) {
    for (const topic of day.topics) {
      if (topic.items.some((i) => i.id === id)) {
        return { day, topic };
      }
    }
  }
  return null;
}

export function getRoadmapItemDetail(
  week: CurriculumWeekDefinition,
  id: string,
  title: string
): AiLearnDetail {
  const ctx = findItemContext(week, id);
  if (!ctx) {
    return {
      answer: `Study "${title}" for Week ${week.id}. Take notes and practice before marking learned.`,
      realWorld: week.goal,
    };
  }

  const { day, topic } = ctx;
  const theme = day.theme ? ` — ${day.theme}` : "";
  const difficulty = topic.difficulty ?? week.difficulty;

  return {
    answer: `This lesson covers "${title}" under ${topic.title} (${day.title}${theme}). Read your course material or notes on this topic, then write a short summary in your own words. If it involves setup or code (JDK, IDE, Hello World), do it hands-on on your machine. Difficulty: ${difficulty}. Mark learned only when you can explain it clearly without looking.`,
    realWorld: `Week ${week.id} goal: ${week.goal}. After lessons, reinforce with Projects (mini builds), AI Skills, and Interview prep — all available for this week from the sidebar.`,
  };
}

export function flattenWeekLessonSections(week: CurriculumWeekDefinition) {
  return week.days.map((day) => ({
    label: day.theme ? `${day.title} · ${day.theme}` : day.title,
    kind: "topic" as const,
    items: day.topics.flatMap((topic) =>
      topic.items.map((item) => ({
        id: item.id,
        title: item.title,
        difficulty: item.difficulty ?? topic.difficulty,
      }))
    ),
  }));
}

export function countWeekLessons(week: CurriculumWeekDefinition) {
  return week.days.reduce(
    (sum, day) => sum + day.topics.reduce((t, topic) => t + topic.items.length, 0),
    0
  );
}

export function countWeekLessonsDone(week: CurriculumWeekDefinition, isDone: (id: string) => boolean) {
  let done = 0;
  week.days.forEach((day) => {
    day.topics.forEach((topic) => {
      topic.items.forEach((item) => {
        if (isDone(item.id)) done += 1;
      });
    });
  });
  return done;
}
