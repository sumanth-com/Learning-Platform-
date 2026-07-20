import type { CurriculumAISkill } from "@/curriculum/types";

export const PROFESSIONAL_AI_WEEK_ID = 12;

export interface ProfessionalAiSkillPack {
  weekId: number;
  weekTitle: string;
  skill: CurriculumAISkill;
}
