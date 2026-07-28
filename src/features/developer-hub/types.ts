export type HubDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type HubContentType =
  | "article"
  | "video"
  | "pdf"
  | "infographic"
  | "interactive"
  | "playground"
  | "github"
  | "boilerplate"
  | "template"
  | "docs";

export type HubCategoryId =
  | "fundamentals"
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai"
  | "system-design"
  | "security"
  | "career"
  | "mobile"
  | "data"
  | "open-source";

export type HubSectionKind =
  | "overview"
  | "objectives"
  | "prerequisites"
  | "meta"
  | "why"
  | "usecases"
  | "interview"
  | "architecture"
  | "implementation"
  | "steps"
  | "diagram"
  | "examples"
  | "code"
  | "best-practices"
  | "mistakes"
  | "performance"
  | "security"
  | "scalability"
  | "debugging"
  | "testing"
  | "deployment"
  | "standards"
  | "summary"
  | "takeaways"
  | "quiz"
  | "challenge"
  | "exercise"
  | "project"
  | "next"
  | "related"
  | "content";

export type HubCodeBlock = {
  language: string;
  title?: string;
  code: string;
};

export type HubSection = {
  id: string;
  title: string;
  body: string;
  kind?: HubSectionKind;
  bullets?: string[];
  code?: HubCodeBlock[];
  diagram?: string;
  checklist?: string[];
};

export type HubResource = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: HubCategoryId;
  type: HubContentType;
  difficulty: HubDifficulty;
  readingMinutes: number;
  author: string;
  tags: string[];
  featured?: boolean;
  pinned?: boolean;
  trending?: boolean;
  updatedAt: string;
  views: number;
  bookmarks: number;
  rating: number;
  coverGradient: string;
  emoji: string;
  sections: HubSection[];
  relatedSlugs?: string[];
  nextSlug?: string;
  externalUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  /** Optional longer overview (falls back to description). */
  overviewBody?: string;
  objectives?: string[];
  prerequisites?: string[];
  takeaways?: string[];
};

export type HubCategoryMeta = {
  id: HubCategoryId;
  label: string;
  emoji: string;
  description: string;
};

export type HubLibraryState = {
  bookmarks: string[];
  recent: { slug: string; at: number; progress: number }[];
  liked: string[];
};
