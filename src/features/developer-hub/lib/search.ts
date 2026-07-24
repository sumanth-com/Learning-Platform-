import { HUB_CATALOG } from "../data/catalog";
import type { HubCategoryId, HubDifficulty, HubResource } from "../types";

export type HubSearchParams = {
  query?: string;
  category?: HubCategoryId | "all";
  difficulty?: HubDifficulty | "all";
  type?: string;
  sort?: "popular" | "updated" | "rating" | "reading";
};

export function searchHubResources(params: HubSearchParams): HubResource[] {
  const q = params.query?.trim().toLowerCase() ?? "";
  let list = [...HUB_CATALOG];

  if (params.category && params.category !== "all") {
    list = list.filter((r) => r.category === params.category);
  }
  if (params.difficulty && params.difficulty !== "all") {
    list = list.filter((r) => r.difficulty === params.difficulty);
  }
  if (params.type && params.type !== "all") {
    list = list.filter((r) => r.type === params.type);
  }
  if (q) {
    list = list.filter((r) => {
      const hay = [
        r.title,
        r.description,
        r.author,
        r.category,
        ...r.tags,
        ...r.sections.map((s) => `${s.title} ${s.body}`),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  switch (params.sort) {
    case "updated":
      list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "reading":
      list.sort((a, b) => a.readingMinutes - b.readingMinutes);
      break;
    case "popular":
    default:
      list.sort((a, b) => b.views - a.views);
      break;
  }

  return list;
}
