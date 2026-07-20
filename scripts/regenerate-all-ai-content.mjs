import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WEEK1_TOPIC_OVERRIDES, WEEK1_EXERCISE_OVERRIDES } from "./ai-week1-overrides.mjs";
import {
  WEEK12_SKILL,
  buildRichTopic,
  buildRichExercise,
  buildWeek12Topic,
  buildWeek12Exercise,
} from "./ai-concise-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const WEEKS_DIR = path.join(ROOT, "src/curriculum/weeks");
const TOPICS_DIR = path.join(ROOT, "src/curriculum/ai-topics");
const EXERCISES_DIR = path.join(ROOT, "src/curriculum/ai-exercises");
const PROFESSIONAL_DIR = path.join(ROOT, "src/curriculum/ai-skills-professional");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function buildTopicEntry(weekNum, topic) {
  if (weekNum === 1 && WEEK1_TOPIC_OVERRIDES[topic.id]) {
    return WEEK1_TOPIC_OVERRIDES[topic.id];
  }
  if (weekNum === 12) {
    return buildWeek12Topic(topic.id, topic.title);
  }
  return buildRichTopic(weekNum, topic.id, topic.title);
}

function buildExerciseEntry(weekNum, exercise) {
  if (weekNum === 1 && WEEK1_EXERCISE_OVERRIDES[exercise.id]) {
    return WEEK1_EXERCISE_OVERRIDES[exercise.id];
  }
  if (weekNum === 12) {
    return buildWeek12Exercise(exercise.id, exercise.title);
  }
  return buildRichExercise(weekNum, exercise.id, exercise.title);
}

function generateWeek(weekNum, allTopics, allExercises) {
  const weekPath = path.join(WEEKS_DIR, `week-${weekNum}.json`);
  const week =
    weekNum <= 11
      ? JSON.parse(fs.readFileSync(weekPath, "utf8"))
      : { aiSkill: WEEK12_SKILL };

  const weekTopics = {};
  for (const topic of week.aiSkill.learningTopics) {
    const detail = buildTopicEntry(weekNum, topic);
    weekTopics[topic.id] = detail;
    allTopics[topic.id] = { title: topic.title, ...detail };
  }

  const weekExercises = {};
  for (const exercise of week.aiSkill.exercises) {
    const detail = buildExerciseEntry(weekNum, exercise);
    weekExercises[exercise.id] = detail;
    allExercises[exercise.id] = { title: exercise.title, ...detail };
  }

  writeJson(path.join(TOPICS_DIR, `week-${weekNum}.json`), weekTopics);
  writeJson(path.join(EXERCISES_DIR, `week-${weekNum}.json`), weekExercises);

  return {
    topics: week.aiSkill.learningTopics.length,
    exercises: week.aiSkill.exercises.length,
  };
}

function main() {
  ensureDir(TOPICS_DIR);
  ensureDir(EXERCISES_DIR);
  ensureDir(PROFESSIONAL_DIR);

  const allTopics = {};
  const allExercises = {};
  const summary = { weeks: [], totals: { topics: 0, exercises: 0 } };

  for (let weekNum = 1; weekNum <= 12; weekNum++) {
    const counts = generateWeek(weekNum, allTopics, allExercises);
    summary.weeks.push({ week: weekNum, ...counts });
    summary.totals.topics += counts.topics;
    summary.totals.exercises += counts.exercises;
  }

  writeJson(path.join(TOPICS_DIR, "all.json"), allTopics);
  writeJson(path.join(EXERCISES_DIR, "all.json"), allExercises);
  writeJson(path.join(PROFESSIONAL_DIR, "skill.json"), WEEK12_SKILL);

  console.log("=== regenerate-all-ai-content.mjs ===");
  console.log("");
  console.log("Files written:");
  console.log("  src/curriculum/ai-topics/week-1.json … week-12.json");
  console.log("  src/curriculum/ai-topics/all.json");
  console.log("  src/curriculum/ai-exercises/week-1.json … week-12.json");
  console.log("  src/curriculum/ai-exercises/all.json");
  console.log("  src/curriculum/ai-skills-professional/skill.json");
  console.log("");
  console.log("Item counts by week:");
  for (const w of summary.weeks) {
    console.log(`  Week ${String(w.week).padStart(2)}: ${w.topics} topics, ${w.exercises} exercises`);
  }
  console.log("");
  console.log(
    `Totals: ${summary.totals.topics} topics, ${summary.totals.exercises} exercises (${Object.keys(allTopics).length} topic entries, ${Object.keys(allExercises).length} exercise entries in all.json)`
  );
}

main();
