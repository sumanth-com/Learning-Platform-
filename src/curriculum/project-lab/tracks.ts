import type {
  BackendLang,
  FrontendLang,
  LabTrack,
  ProgrammingLang,
  ProjectLabContext,
} from "./types";

export const TRACK_OPTIONS: { id: LabTrack; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "languages", label: "Programming Languages" },
];

export const FRONTEND_LANGS: { id: FrontendLang; label: string; monaco: string }[] = [
  { id: "html", label: "HTML", monaco: "html" },
  { id: "css", label: "CSS", monaco: "css" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
];

export const BACKEND_LANGS: { id: BackendLang; label: string; monaco: string }[] = [
  { id: "nodejs", label: "Node.js", monaco: "javascript" },
  { id: "express", label: "Express", monaco: "javascript" },
  { id: "fastapi", label: "FastAPI", monaco: "python" },
  { id: "spring", label: "Spring Boot", monaco: "java" },
  { id: "django", label: "Django", monaco: "python" },
  { id: "dotnet", label: ".NET", monaco: "csharp" },
];

export const PROGRAMMING_LANGS: {
  id: ProgrammingLang;
  label: string;
  monaco: string;
}[] = [
  { id: "java", label: "Java", monaco: "java" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "c", label: "C", monaco: "c" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "go", label: "Go", monaco: "go" },
  { id: "rust", label: "Rust", monaco: "rust" },
  { id: "csharp", label: "C#", monaco: "csharp" },
];

export function defaultTrackForProject(ctx: ProjectLabContext): LabTrack {
  if (ctx.category === "Web App") return "frontend";
  if (ctx.category === "API" || ctx.category === "Docker Compose") return "backend";
  return "languages";
}

export function defaultLanguageForTrack(
  track: LabTrack,
  ctx: ProjectLabContext
): string {
  if (track === "frontend") return "html";
  if (track === "backend") {
    if (ctx.moduleSlug.includes("auth") || ctx.moduleSlug.includes("apis"))
      return "express";
    if (ctx.moduleSlug.includes("python") || ctx.category === "CLI") return "fastapi";
    return "nodejs";
  }
  if (ctx.moduleSlug === "typescript" || ctx.moduleSlug === "javascript")
    return "javascript";
  if (ctx.moduleSlug.includes("java") || ctx.moduleNumber <= 2) return "java";
  return "python";
}

export function languageLabel(track: LabTrack, language: string): string {
  if (track === "frontend") {
    return FRONTEND_LANGS.find((l) => l.id === language)?.label ?? language;
  }
  if (track === "backend") {
    return BACKEND_LANGS.find((l) => l.id === language)?.label ?? language;
  }
  return PROGRAMMING_LANGS.find((l) => l.id === language)?.label ?? language;
}

export function monacoLanguage(track: LabTrack, language: string): string {
  if (track === "frontend") {
    return FRONTEND_LANGS.find((l) => l.id === language)?.monaco ?? "plaintext";
  }
  if (track === "backend") {
    return BACKEND_LANGS.find((l) => l.id === language)?.monaco ?? "plaintext";
  }
  return PROGRAMMING_LANGS.find((l) => l.id === language)?.monaco ?? "plaintext";
}
