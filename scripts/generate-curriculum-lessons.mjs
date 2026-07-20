/**
 * Generates bundled lessons for all 19 roadmap sections.
 * Each subtopic gets 32+ patterns in the Patterns dropdown.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildGenericPatterns, LOOP_TOPIC_SLUGS } from "./pattern-library.mjs";
import { LOOP_PATTERNS } from "./loop-patterns-data.mjs";
import { difficultyForIndex } from "./difficulty.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JAVA_ROADMAP_CURRICULUM = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/curriculum/java-roadmap/week-curriculum.json"), "utf8")
);

function code(cls, body) {
  return `public class ${cls} {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
}

function clsName(sectionSlug, subSlug, idx) {
  const base = (sectionSlug + subSlug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .slice(0, 22);
  return `${base}${idx}`;
}

function topicLesson(sectionSlug, sub, idx) {
  const cls = clsName(sectionSlug, sub.slug, idx);
  const title = sub.title;
  return {
    id: sub.slug,
    title,
    category: "topics",
    kind: "code",
    definition: `${title} — learn the concept in plain language, then study the code and click Run.`,
    explanation: `This lesson covers ${title}. Select this topic, then open the Patterns dropdown for 30+ examples and interview problems.`,
    code: code(
      cls,
      `        System.out.println("Topic: ${title}");
        System.out.println("Section: ${sectionSlug.replace(/-/g, " ")}");
        System.out.println("Open Patterns dropdown for 30+ examples!");`
    ),
    filename: `${cls}.java`,
    sampleOutput: `Topic: ${title}\nSection: ${sectionSlug.replace(/-/g, " ")}\nOpen Patterns dropdown for 30+ examples!`,
    runInstructions: `javac ${cls}.java\njava ${cls}`,
  };
}

function toPatternLesson(sectionSlug, subSlug, patternDef, patternIndex, clsIdx) {
  const cls = clsName(sectionSlug, subSlug, clsIdx);
  const id = `${subSlug}-pat-${String(patternIndex).padStart(2, "0")}`;
  const difficulty = patternDef.difficulty ?? "easy";
  const diffTag = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  return {
    id,
    title: patternDef.title,
    category: "patterns",
    parentTopic: subSlug,
    difficulty,
    kind: "code",
    definition: `[${diffTag}] ${patternDef.definition}`,
    explanation: patternDef.explanation,
    code: patternDef.code ?? code(cls, patternDef.body),
    filename: patternDef.filename ?? `${cls}.java`,
    sampleOutput: patternDef.sampleOutput ?? patternDef.output,
    runInstructions: patternDef.runInstructions ?? `javac ${cls}.java\njava ${cls}`,
  };
}

function loopPatternsForSubtopic(sectionSlug, subSlug, clsStartIdx) {
  return LOOP_PATTERNS.map((p, i) => {
    const difficulty = difficultyForIndex(i);
    return toPatternLesson(
      sectionSlug,
      subSlug,
      {
        title: p.title,
        definition: p.definition,
        explanation: p.explanation,
        code: p.code,
        filename: p.filename,
        sampleOutput: p.sampleOutput,
        runInstructions: p.runInstructions,
        difficulty,
      },
      i + 1,
      clsStartIdx + i
    );
  });
}

function genericPatternsForSubtopic(sectionSlug, sub, clsStartIdx) {
  return buildGenericPatterns(sub.title).map((p, i) =>
    toPatternLesson(sectionSlug, sub.slug, p, i + 1, clsStartIdx + i)
  );
}

function patternLessons(sectionSlug, sub, clsStartIdx) {
  if (LOOP_TOPIC_SLUGS.has(sub.slug)) {
    return loopPatternsForSubtopic(sectionSlug, sub.slug, clsStartIdx);
  }
  return genericPatternsForSubtopic(sectionSlug, sub, clsStartIdx);
}

function buildSectionLessons(section) {
  const subtopics = [];
  let clsIdx = 1;
  for (const sub of section.subtopics) {
    subtopics.push(topicLesson(section.slug, sub, clsIdx++));
    const patterns = patternLessons(section.slug, sub, clsIdx);
    subtopics.push(...patterns);
    clsIdx += patterns.length;
  }
  return {
    slug: section.slug,
    weekId: section.weekId,
    categories: [
      { id: "topics", label: "Topics" },
      { id: "patterns", label: "Problems & Patterns" },
    ],
    subtopics,
  };
}

const all = {};
for (const section of JAVA_ROADMAP_CURRICULUM) {
  all[section.slug] = buildSectionLessons(section);
}

const outPath = path.join(__dirname, "../src/curriculum/java-roadmap/lessons/bundled-lessons.json");
fs.writeFileSync(outPath, JSON.stringify(all, null, 2) + "\n");

const totalLessons = Object.values(all).reduce((n, s) => n + s.subtopics.length, 0);
const forLoopPatterns = all["week-2"]?.subtopics.filter(
  (s) => s.category === "patterns" && s.parentTopic === "for-loop"
).length;
console.log(
  `Generated ${Object.keys(all).length} sections, ${totalLessons} total lessons → ${outPath}`
);
console.log(`For Loop patterns: ${forLoopPatterns}`);
