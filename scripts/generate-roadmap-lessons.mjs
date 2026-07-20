import fs from "fs";
import path from "path";
import { buildLoopsLessons } from "./loop-patterns-data.mjs";
import { buildRichTopicLessons } from "./topic-lessons-builder.mjs";

const topicsFile = fs.readFileSync("src/curriculum/java-roadmap/topics.ts", "utf8");
const slugTitlePairs = [...topicsFile.matchAll(/t\("([^"]+)",\s*"([^"]+)"/g)].map((m) => ({
  slug: m[1],
  title: m[2],
}));

const OVERRIDES = {
  loops: buildLoopsLessons(),
};

const all = {};
for (const { slug, title } of slugTitlePairs) {
  all[slug] = OVERRIDES[slug] ?? buildRichTopicLessons(slug, title);
}

const outPath = path.join("src/curriculum/java-roadmap/lessons/bundled-lessons.json");
fs.writeFileSync(outPath, JSON.stringify(all, null, 2) + "\n");
console.log(`Generated lessons for ${Object.keys(all).length} roadmap topics → ${outPath}`);
