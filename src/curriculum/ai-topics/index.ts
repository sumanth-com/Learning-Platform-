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

export function getAiTopicDetail(id: string, title: string): AiLearnDetail {
  const found = CONTENT[id];
  if (found) return found;

  return {
    answer: `${title} is an important concept for learning AI skills alongside Java. Read the explanation carefully and try explaining it in your own words.`,
    realWorld: `Apply this while working on your Java assignments this week. Write a small code example in your IDE to connect the concept to real code.`,
  };
}
