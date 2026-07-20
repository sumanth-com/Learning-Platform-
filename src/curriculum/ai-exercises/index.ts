import week1 from "./week-1.json";
import week2 from "./week-2.json";
import week3 from "./week-3.json";
import week4 from "./week-4.json";
import week5 from "./week-5.json";
import week6 from "./week-6.json";
import week7 from "./week-7.json";
import week8 from "./week-8.json";
import week9 from "./week-9.json";
import week10 from "./week-10.json";
import week11 from "./week-11.json";
import week12 from "./week-12.json";
import type { AiLearnDetail } from "@/curriculum/ai-content/types";

const CONTENT: Record<string, AiLearnDetail> = {
  ...(week1 as Record<string, AiLearnDetail>),
  ...(week2 as Record<string, AiLearnDetail>),
  ...(week3 as Record<string, AiLearnDetail>),
  ...(week4 as Record<string, AiLearnDetail>),
  ...(week5 as Record<string, AiLearnDetail>),
  ...(week6 as Record<string, AiLearnDetail>),
  ...(week7 as Record<string, AiLearnDetail>),
  ...(week8 as Record<string, AiLearnDetail>),
  ...(week9 as Record<string, AiLearnDetail>),
  ...(week10 as Record<string, AiLearnDetail>),
  ...(week11 as Record<string, AiLearnDetail>),
  ...(week12 as Record<string, AiLearnDetail>),
};

export function getAiExerciseDetail(id: string, title: string): AiLearnDetail {
  const found = CONTENT[id];
  if (found) return found;

  const clean = title.replace(/^Ask AI to /i, "").replace(/\.$/, "");
  return {
    answer: `Study "${clean}" using the explanation here. Read it twice, then write a small Java example in your IDE to prove you understand it.`,
    realWorld: `Apply this in your current week's project. Mark complete only after you can explain the idea without looking at the screen.`,
  };
}
