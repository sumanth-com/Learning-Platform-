export type LabTrack = "frontend" | "backend" | "languages";

export type FrontendLang = "html" | "css" | "javascript";
export type BackendLang =
  | "nodejs"
  | "express"
  | "fastapi"
  | "spring"
  | "django"
  | "dotnet";
export type ProgrammingLang =
  | "java"
  | "python"
  | "javascript"
  | "c"
  | "cpp"
  | "go"
  | "rust"
  | "csharp";

export type LabLanguage = FrontendLang | BackendLang | ProgrammingLang;

export type LabCodeFile = {
  id: string;
  label: string;
  filename: string;
  language: string; // monaco language id
  code: string;
};

export type CodeBlockLesson = {
  name: string;
  purpose: string;
  inputs: string;
  output: string;
  logic: string;
  analogy: string;
};

export type TeachSection = {
  id: string;
  title: string;
  body: string;
};

export type ProjectLabLesson = {
  track: LabTrack;
  language: LabLanguage;
  languageLabel: string;
  greeting: string;
  sections: TeachSection[];
  implementationSteps: string[];
  codeBlocks: CodeBlockLesson[];
  bestPractices: string[];
  commonMistakes: string[];
  workflow: { title: string; body: string }[];
  interviewQuestions: { question: string; answer: string }[];
  summary: {
    learned: string[];
    skills: string[];
    nextProject: string;
  };
  files: LabCodeFile[];
};

export type ProjectLabContext = {
  id: string;
  title: string;
  description: string;
  moduleNumber: number;
  moduleTitle: string;
  moduleSlug: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  features: { id: string; title: string }[];
};
