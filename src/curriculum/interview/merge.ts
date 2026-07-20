import type {
  CurriculumInterviewCategory,
  CurriculumInterviewPack,
  CurriculumWeekDefinition,
} from "../types";
import week1Interview from "./week-1.json";
import week2Interview from "./week-2.json";
import week3Interview from "./week-3.json";
import week4Interview from "./week-4.json";
import week5Interview from "./week-5.json";
import week6Interview from "./week-6.json";
import week7Interview from "./week-7.json";
import week8Interview from "./week-8.json";
import week9Interview from "./week-9.json";
import apiInterview from "./api.json";
import dbInterview from "./db.json";

const INTERVIEW_BY_WEEK: Record<number, CurriculumInterviewCategory[]> = {
  1: week1Interview as CurriculumInterviewCategory[],
  2: week2Interview as CurriculumInterviewCategory[],
  3: week3Interview as CurriculumInterviewCategory[],
  4: week4Interview as CurriculumInterviewCategory[],
  5: week5Interview as CurriculumInterviewCategory[],
  6: week6Interview as CurriculumInterviewCategory[],
  7: week7Interview as CurriculumInterviewCategory[],
  8: week8Interview as CurriculumInterviewCategory[],
  9: week9Interview as CurriculumInterviewCategory[],
};

const SUPPLEMENTAL_PACKS: CurriculumInterviewPack[] = [
  apiInterview as CurriculumInterviewPack,
  dbInterview as CurriculumInterviewPack,
];

/** Merge rich interview content into a week definition */
export function withInterviewContent(week: CurriculumWeekDefinition): CurriculumWeekDefinition {
  const interviewQuestions = INTERVIEW_BY_WEEK[week.id];
  if (!interviewQuestions) return week;
  return { ...week, interviewQuestions };
}

export function getSupplementalInterviewPacks(): CurriculumInterviewPack[] {
  return SUPPLEMENTAL_PACKS;
}

export function countInterviewQuestions(categories: CurriculumInterviewCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.questions.length, 0);
}
