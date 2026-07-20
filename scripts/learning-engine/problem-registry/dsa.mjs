import { buildDsaLessons } from "../builders.mjs";
import { generateCuratedProblems } from "../lib/curated-engine.mjs";

export function getDsaProblems(weekId, topic) {
  const topicIndex = topic.topicIndex ?? 0;
  const topicCount = topic.topicCount ?? 1;
  const problems = generateCuratedProblems(
    topic.slug,
    topic.title ?? topic.slug.replace(/-/g, " "),
    "dsa",
    topicIndex,
    topicCount
  );
  return buildDsaLessons(weekId, topic.slug, problems);
}
