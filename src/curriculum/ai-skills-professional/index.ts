import skillJson from "./skill.json";
import type { CurriculumAISkill } from "@/curriculum/types";
import { PROFESSIONAL_AI_WEEK_ID } from "./types";

export { PROFESSIONAL_AI_WEEK_ID } from "./types";

const skill = skillJson as CurriculumAISkill;

export function getProfessionalAiSkill(): CurriculumAISkill {
  return skill;
}

export function isProfessionalAiWeek(weekId: number) {
  return weekId === PROFESSIONAL_AI_WEEK_ID;
}

export function getProfessionalAiWeekTitle() {
  return "Professional Gen AI Mastery";
}
