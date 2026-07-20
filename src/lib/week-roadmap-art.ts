import type { StaticImageData } from "next/image";

import week01Art from "@/assets/Week 01.webp";
import week02Art from "@/assets/Week 02.webp";
import week03Art from "@/assets/Week 03.webp";
import week04Art from "@/assets/Week 04.webp";
import week05Art from "@/assets/Week 05.webp";
import week06Art from "@/assets/Week 06.webp";
import week07Art from "@/assets/Week 07.webp";
import week08Art from "@/assets/Week 08.webp";
import week09Art from "@/assets/Week 09.webp";
import week10Art from "@/assets/Week 10.webp";
import week11Art from "@/assets/Week 11.webp";
import week12Art from "@/assets/Week 12.webp";

export const WEEK_ROADMAP_ART: Record<number, StaticImageData> = {
  1: week01Art,
  2: week02Art,
  3: week03Art,
  4: week04Art,
  5: week05Art,
  6: week06Art,
  7: week07Art,
  8: week08Art,
  9: week09Art,
  10: week10Art,
  11: week11Art,
  12: week12Art,
};

export function getWeekRoadmapArt(weekId: number): StaticImageData | undefined {
  return WEEK_ROADMAP_ART[weekId];
}
