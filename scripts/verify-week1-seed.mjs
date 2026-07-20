/** Verify Week 1 seed marks all progress IDs — run: node scripts/verify-week1-seed.mjs */
import { readFileSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const bundle = JSON.parse(readFileSync(path.join(root, "src/learning-engine/content/bundle.json"), "utf8"));
const week1 = JSON.parse(readFileSync(path.join(root, "src/curriculum/weeks/week-1.json"), "utf8"));

function lessonEntityId(weekId, topicSlug, id) {
  return `learn-w${weekId}-${topicSlug}-${id}`;
}

const learnWeek = bundle.weeks.find((w) => w.weekId === 1);
const practiceIds = [];
for (const bundle of learnWeek.topics) {
  for (const lesson of bundle.lessons) {
    if (lesson.problemType === "mcq") continue;
    if (lesson.weekId && lesson.weekId !== 1) continue;
    practiceIds.push(
      lessonEntityId(1, lesson.topicSlug ?? bundle.topic.slug, lesson.id)
    );
  }
}

function idsOfType(type) {
  const ids = [];
  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    if (obj.id && obj.type === type) ids.push(obj.id);
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") walk(v);
    }
  }
  walk(week1);
  return ids;
}

const ai = [...idsOfType("ai-topic"), ...idsOfType("ai-exercise"), ...idsOfType("ai-prompt")];
const projects = idsOfType("project-complete");
const github = idsOfType("github-file");
const interview = idsOfType("interview-question");

console.log("Week 1 ID counts:");
console.log("  practice (hub):", practiceIds.length);
console.log("  ai:", ai.length);
console.log("  projects:", projects.length);
console.log("  github:", github.length);
console.log("  interview:", interview.length);
console.log("  total java track:", practiceIds.length + ai.length + projects.length + github.length + interview.length);
