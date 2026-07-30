import type {
  CertCategoryId,
  CertLevel,
  Certification,
} from "../types";
import { codingChallenges } from "./coding-challenges";

export const CERT_LEVELS: CertLevel[] = ["basic", "intermediate"];

export const LEVEL_META: Record<
  CertLevel,
  { label: string; duration: number; questions: number; passing: number; xp: number }
> = {
  basic: { label: "Basic", duration: 60, questions: 3, passing: 70, xp: 150 },
  intermediate: {
    label: "Intermediate",
    duration: 90,
    questions: 6,
    passing: 70,
    xp: 300,
  },
};

export const CERT_CATEGORIES: {
  id: CertCategoryId;
  label: string;
  blurb: string;
  accent: string;
  mark: string;
}[] = [
  { id: "javascript", label: "JavaScript", blurb: "Language fundamentals", accent: "#F7DF1E", mark: "JS" },
  { id: "typescript", label: "TypeScript", blurb: "Types & safe scale", accent: "#3178C6", mark: "TS" },
  { id: "react", label: "React", blurb: "Components & hooks", accent: "#61DAFB", mark: "R" },
  { id: "nextjs", label: "Next.js", blurb: "App Router & SSR", accent: "#A3A3A3", mark: "N" },
  { id: "nodejs", label: "Node.js", blurb: "Runtime & servers", accent: "#68A063", mark: "No" },
  { id: "python", label: "Python", blurb: "Core Python", accent: "#3776AB", mark: "Py" },
  { id: "java", label: "Java", blurb: "OOP & JVM", accent: "#ED8B00", mark: "Jv" },
  { id: "sql", label: "SQL", blurb: "Queries & modeling", accent: "#336791", mark: "SQ" },
  { id: "docker", label: "Docker", blurb: "Containers", accent: "#2496ED", mark: "Dk" },
  { id: "frontend", label: "Frontend", blurb: "UI systems", accent: "#38BDF8", mark: "Fe" },
  { id: "backend", label: "Backend", blurb: "APIs & services", accent: "#A78BFA", mark: "Be" },
  { id: "algorithms", label: "Algorithms", blurb: "Problem solving", accent: "#FDBA74", mark: "Al" },
  { id: "data-structures", label: "Data Structures", blurb: "Core structures", accent: "#FB7185", mark: "DS" },
  { id: "system-design", label: "System Design", blurb: "Scale & trade-offs", accent: "#F472B6", mark: "SD" },
  { id: "ai-engineering", label: "AI Engineering", blurb: "Production AI", accent: "#A3E635", mark: "AI" },
  { id: "git", label: "Git", blurb: "Version control", accent: "#F05032", mark: "Gt" },
  { id: "devops", label: "DevOps", blurb: "CI/CD", accent: "#C084FC", mark: "Ops" },
  { id: "mongodb", label: "MongoDB", blurb: "Documents", accent: "#47A248", mark: "Mg" },
  { id: "postgresql", label: "PostgreSQL", blurb: "Relational", accent: "#4169E1", mark: "Pg" },
  { id: "prompt-engineering", label: "Prompt Engineering", blurb: "Reliable prompts", accent: "#FDE047", mark: "PE" },
  { id: "rag", label: "RAG", blurb: "Retrieval pipelines", accent: "#2DD4BF", mark: "RG" },
  { id: "langchain", label: "LangChain", blurb: "Chains & tools", accent: "#1C3C3C", mark: "LC" },
  { id: "langgraph", label: "LangGraph", blurb: "Agent graphs", accent: "#818CF8", mark: "LG" },
];

function buildCertification(
  categoryId: CertCategoryId,
  label: string,
  level: CertLevel
): Certification {
  const meta = LEVEL_META[level];
  const questions = codingChallenges(
    categoryId,
    level,
    `${categoryId}-${level}`
  ).slice(
    0,
    meta.questions
  );

  const shortTitle = `${label} (${meta.label})`;

  return {
    id: `${categoryId}-${level}`,
    categoryId,
    categoryLabel: label,
    level,
    title: shortTitle,
    shortTitle,
    description: `SupraBase ${shortTitle} Skills Certification Test — trusted signal for engineering hiring.`,
    durationMinutes: meta.duration,
    questionCount: questions.length,
    passingScore: meta.passing,
    xp: meta.xp,
    oneAttempt: false,
    questions,
  };
}

export const CERTIFICATIONS: Certification[] = CERT_CATEGORIES.flatMap((cat) =>
  CERT_LEVELS.map((level) => buildCertification(cat.id, cat.label, level))
);

const questionSignatures = new Set<string>();
for (const certification of CERTIFICATIONS) {
  for (const question of certification.questions) {
    const signature = `${question.title ?? ""}\n${question.prompt}`
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (questionSignatures.has(signature)) {
      throw new Error(
        `Duplicate certification question detected: ${question.title ?? question.id}`
      );
    }
    questionSignatures.add(signature);
  }
}

export function getCertification(id: string) {
  return CERTIFICATIONS.find((c) => c.id === id) ?? null;
}

/** Lightweight card/timer meta — does not load coding questions. */
export function getCertCardMeta(id: string) {
  for (const cat of CERT_CATEGORIES) {
    for (const level of CERT_LEVELS) {
      const certId = `${cat.id}-${level}`;
      if (certId !== id) continue;
      const meta = LEVEL_META[level];
      return {
        id: certId,
        categoryId: cat.id,
        categoryLabel: cat.label,
        level,
        shortTitle: `${cat.label} (${meta.label})`,
        title: `${cat.label} (${meta.label})`,
        durationMinutes: meta.duration,
        questionCount: meta.questions,
        passingScore: meta.passing,
        xp: meta.xp,
      };
    }
  }
  return null;
}

export function getCertificationsByCategory(categoryId: CertCategoryId) {
  return CERTIFICATIONS.filter((c) => c.categoryId === categoryId);
}

export function categoryMeta(id: CertCategoryId) {
  return CERT_CATEGORIES.find((c) => c.id === id)!;
}
