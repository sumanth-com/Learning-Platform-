/**
 * Build learning-engine content bundle from curriculum + topic banks.
 * Run: node scripts/learning-engine/build.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getLessonsForTopic } from "./topic-banks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../../");

const curriculum = JSON.parse(
  fs.readFileSync(path.join(root, "src/learning-engine/curriculum.json"), "utf8")
);

const bundle = {
  version: 1,
  generatedAt: new Date().toISOString(),
  weeks: [],
  stats: { topics: 0, lessons: 0, byCategory: {}, byDifficulty: { easy: 0, medium: 0, hard: 0 } },
};

for (const week of curriculum) {
  const topicBundles = week.topics.map((topic, topicIndex) => {
    const enrichedTopic = { ...topic, topicIndex, topicCount: week.topics.length };
    const lessons = getLessonsForTopic(week.weekId, enrichedTopic);
    bundle.stats.topics++;
    bundle.stats.lessons += lessons.length;
    for (const l of lessons) {
      bundle.stats.byCategory[l.category] = (bundle.stats.byCategory[l.category] || 0) + 1;
      bundle.stats.byDifficulty[l.difficulty]++;
    }
    return { topic, weekId: week.weekId, lessons };
  });

  bundle.weeks.push({
    weekId: week.weekId,
    slug: week.slug,
    title: week.title,
    description: week.description,
    topics: topicBundles,
  });
}

const outDir = path.join(root, "src/learning-engine/content");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify(bundle, null, 2) + "\n");

// Also update java-roadmap week-curriculum for roadmap UI compatibility
const weekCurriculum = curriculum.map((w) => ({
  weekId: w.weekId,
  slug: w.slug,
  title: w.title,
  emoji: "",
  theme: ["candy-blue", "candy-pink", "candy-purple", "candy-cyan", "candy-gold", "candy-teal", "candy-orange", "candy-red", "candy-indigo", "candy-green", "candy-royal", "candy-indigo"][w.weekId - 1],
  badge: w.weekId === 1 ? "Start Here" : w.weekId === 12 ? "Graduate" : undefined,
  description: w.description,
  subtopics: w.topics.map((t) => ({ slug: t.slug, title: t.title, category: t.category })),
}));
fs.writeFileSync(
  path.join(root, "src/curriculum/java-roadmap/week-curriculum.json"),
  JSON.stringify(weekCurriculum, null, 2) + "\n"
);

console.log(`Built learning engine: ${bundle.stats.topics} topics, ${bundle.stats.lessons} lessons`);
console.log("By category:", bundle.stats.byCategory);
console.log("By difficulty:", bundle.stats.byDifficulty);
console.log(`→ ${path.join(outDir, "bundle.json")}`);
