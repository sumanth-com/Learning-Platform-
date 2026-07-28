export type CertLevel = "basic" | "intermediate";

export type QuestionKind =
  | "mcq"
  | "debug"
  | "output"
  | "architecture"
  | "scenario"
  | "code"
  | "syntax";

export type CertCategoryId =
  | "frontend"
  | "backend"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "nodejs"
  | "python"
  | "java"
  | "sql"
  | "mongodb"
  | "postgresql"
  | "docker"
  | "git"
  | "devops"
  | "system-design"
  | "ai-engineering"
  | "prompt-engineering"
  | "rag"
  | "langchain"
  | "langgraph"
  | "data-structures"
  | "algorithms";

export type CodeTestCase = {
  id: string;
  name?: string;
  /** JS expression args passed to the exported function, e.g. "[[2,7,11,15], 9]" */
  call: string;
  expected: unknown;
  hidden?: boolean;
};

export type AssessmentQuestion = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  answer: string | number;
  acceptContains?: string[];
  code?: string;
  starterCode?: string;
  language?: "javascript" | "typescript" | "python" | "sql" | "java" | "shell" | "json";
  explanation?: string;
  title?: string;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
  hints?: string[];
  timeLimit?: string;
  /** Exported function name for the runner */
  entryFn?: string;
  tests?: CodeTestCase[];
};

export type Certification = {
  id: string;
  categoryId: CertCategoryId;
  categoryLabel: string;
  level: CertLevel;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
  xp: number;
  oneAttempt: boolean;
  questions: AssessmentQuestion[];
};

export type AttemptStatus = "in-progress" | "passed" | "failed";

export type AssessmentAttempt = {
  certificationId: string;
  status: AttemptStatus;
  answers: Record<string, string | number>;
  startedAt: string;
  finishedAt?: string;
  score?: number;
  correctCount?: number;
  weakAreas?: string[];
  currentIndex?: number;
  remainingSeconds?: number;
  /** Absolute end time for the live timer (ms). Survives refresh. */
  timerEndsAt?: number;
  confirmedName?: string;
  agreeHonor?: boolean;
  agreeTerms?: boolean;
  /** Last flow path segment visited (brief|plan|…|lobby|problems) */
  lastPath?: string;
  /** Selected editor language per question id */
  codeLanguages?: Record<string, string>;
  /** Saved drafts keyed by `${questionId}__${language}` */
  codeDrafts?: Record<string, string>;
  /** Questions the learner marked complete in the lobby */
  completedQuestionIds?: string[];
};

export type EarnedCertificate = {
  id: string;
  certificationId: string;
  recipientName: string;
  issuedAt: string;
  score: number;
  level: CertLevel;
  technology: string;
  title: string;
  verifyPath: string;
};

export type CertProgressState = {
  attempts: Record<string, AssessmentAttempt>;
  certificates: EarnedCertificate[];
  xp: number;
  badges: string[];
};

export type TestRunResult = {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  hidden?: boolean;
};
