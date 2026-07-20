/**
 * Learning Engine lesson source — all 69 topics × 9 problems from problem-registry.
 * Run `npm run build:learning` after editing registry files.
 */
import { getRegistryLessons } from "./problem-registry/index.mjs";
import { assertNotPlaceholder } from "./lib/rich-fields.mjs";

export function getLessonsForTopic(weekId, topic) {
  const lessons = getRegistryLessons(weekId, topic);
  for (const lesson of lessons) {
    assertNotPlaceholder(lesson);
  }
  return lessons;
}
