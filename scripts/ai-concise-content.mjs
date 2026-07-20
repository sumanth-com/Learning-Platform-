/** Short, unique AI curriculum content — replaces verbose ai-rich-content.mjs */

import { WEEKS_2_6 } from "./curriculum/ai-bank/weeks-2-6.mjs";
import { WEEKS_7_12 } from "./curriculum/ai-bank/weeks-7-12.mjs";
import { WEEK1_TOPIC_OVERRIDES, WEEK1_EXERCISE_OVERRIDES } from "./ai-week1-overrides.mjs";

export { WEEK12_SKILL } from "./ai-rich-content.mjs";

const BANK = {
  ...WEEK1_TOPIC_OVERRIDES,
  ...WEEK1_EXERCISE_OVERRIDES,
  ...WEEKS_2_6,
  ...WEEKS_7_12,
};

export function buildRichTopic(weekNum, id, title) {
  const entry = BANK[id];
  if (entry) return { answer: entry.answer, realWorld: entry.realWorld };
  return fallbackTopic(weekNum, title);
}

export function buildRichExercise(weekNum, id, title) {
  const entry = BANK[id];
  if (entry) {
    const result = { answer: entry.answer, realWorld: entry.realWorld };
    if (entry.code) result.code = entry.code;
    return result;
  }
  return fallbackExercise(weekNum, title);
}

export function buildWeek12Topic(id, title) {
  return buildRichTopic(12, id, title);
}

export function buildWeek12Exercise(id, title) {
  return buildRichExercise(12, id, title);
}

function fallbackTopic(weekNum, title) {
  return {
    answer: `**${title}** — core AI skill for Week ${weekNum}. Read once, try one Java example in your IDE, explain aloud in your own words.`,
    realWorld: `Use this while building Week ${weekNum} projects. Verify every AI suggestion by compiling and running before you commit.`,
  };
}

function fallbackExercise(weekNum, title) {
  return {
    answer: `**Practice:** ${title.replace(/\.$/, "")}. Try yourself for 15 minutes, then use AI to compare — don't skip the thinking.`,
    realWorld: `Apply on real code from Week ${weekNum}. Mark complete only after you ran and understood the result.`,
  };
}
