/** Learning Engine — category-driven lesson schema (LeetCode + SQLBolt + HackerRank) */

export type LearnDifficulty = "easy" | "medium" | "hard";

export type LearnCategory =
  | "java"
  | "oop"
  | "collections"
  | "java8"
  | "multithreading"
  | "dsa"
  | "sql"
  | "database-design"
  | "jdbc"
  | "spring-boot"
  | "rest-api"
  | "security"
  | "hibernate"
  | "mongodb"
  | "git"
  | "ai";

export type EditorLanguage = "java" | "sql" | "json" | "bash" | "text" | "prompt";

export interface LearnTopicDefinition {
  slug: string;
  title: string;
  category: LearnCategory;
  description: string;
}

export interface LearnWeekDefinition {
  weekId: number;
  slug: string;
  title: string;
  description: string;
  topics: LearnTopicDefinition[];
}

export type ProblemType =
  | "pattern"
  | "logic"
  | "output-prediction"
  | "find-bug"
  | "mcq"
  | "dry-run"
  | "interview"
  | "hackerrank"
  | "leetcode"
  | "company"
  | "optimization"
  | "debugging"
  | "nested-pattern"
  | "select"
  | "insert"
  | "update"
  | "join"
  | "aggregate"
  | "subquery"
  | "transaction"
  | "controller"
  | "service"
  | "repository"
  | "jwt"
  | "prompt"
  | "terminal";

export interface ExecutionTraceStep {
  line: number;
  action: string;
  state: string;
}

export interface ProblemApproach {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

/** LeetCode / GFG-style rich metadata shared across lesson categories */
export interface LearnProblemRich {
  problemType?: ProblemType;
  estimatedMinutes?: number;
  hints?: string[];
  executionTrace?: ExecutionTraceStep[];
  patternPreview?: string;
  problemStatement?: string;
  companyTags?: string[];
  constraints?: string[];
  exampleInput?: string;
  exampleOutput?: string;
  stepByStepExplanation?: string;
  approaches?: ProblemApproach[];
  dryRun?: string;
  visualization?: string;
  alternativeSolutions?: string[];
  followUpQuestions?: string[];
  practiceVariations?: string[];
}

export interface BaseLesson extends LearnProblemRich {
  id: string;
  topicSlug: string;
  weekId: number;
  title: string;
  difficulty: LearnDifficulty;
  category: LearnCategory;
  description: string;
}

export interface JavaLikeLesson extends BaseLesson {
  category: "java" | "oop" | "collections" | "java8" | "multithreading" | "dsa" | "jdbc" | "spring-boot" | "hibernate";
  explanation: string;
  syntax?: string;
  code: string;
  filename: string;
  expectedOutput: string;
  memoryDiagram?: string;
  commonMistakes: string[];
  interviewTips: string[];
  practiceQuestions: string[];
  hiddenSolution?: string;
  editorLanguage: "java";
}

export interface SqlLesson extends BaseLesson {
  category: "sql";
  schema: { table: string; columns: { name: string; type: string }[] }[];
  sampleData: { table: string; rows: string[][] }[];
  query: string;
  expectedResult: { columns: string[]; rows: string[][] };
  executionExplanation: string;
  optimizationTip?: string;
  alternativeQuery?: string;
  commonMistakes: string[];
  editorLanguage: "sql";
}

export interface DatabaseDesignLesson extends BaseLesson {
  category: "database-design";
  erDiagram: string;
  tables: { name: string; columns: string[]; primaryKey?: string }[];
  relationships: string[];
  normalization: string;
  indexes: string[];
  realWorldExample: string;
  commonMistakes: string[];
  editorLanguage: "text";
}

export interface RestApiLesson extends BaseLesson {
  category: "rest-api";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  statusCode: number;
  postmanExample: string;
  curlExample: string;
  apiDiagram: string;
  commonMistakes: string[];
  editorLanguage: "json";
}

export interface SecurityLesson extends BaseLesson {
  category: "security";
  authFlow: string;
  jwtDiagram?: string;
  requestFlow: string;
  tokenExample?: string;
  headers: Record<string, string>;
  roles: string[];
  permissions: string[];
  exampleApi: string;
  code?: string;
  filename?: string;
  commonMistakes: string[];
  editorLanguage: "java" | "json";
}

export interface MongoDbLesson extends BaseLesson {
  category: "mongodb";
  document: string;
  collection: string;
  query: string;
  aggregation?: string;
  expectedOutput: string;
  sqlComparison: string;
  commonMistakes: string[];
  editorLanguage: "json";
}

export interface GitLesson extends BaseLesson {
  category: "git";
  command: string;
  terminalOutput: string;
  workflowDiagram: string;
  explanation: string;
  commonMistakes: string[];
  editorLanguage: "bash";
}

export interface AiLesson extends BaseLesson {
  category: "ai";
  concept: string;
  prompt: string;
  goodPrompt: string;
  badPrompt: string;
  aiOutput: string;
  whyAiResponded: string;
  exercise: string;
  editorLanguage: "prompt";
}

export type LearnLesson =
  | JavaLikeLesson
  | SqlLesson
  | DatabaseDesignLesson
  | RestApiLesson
  | SecurityLesson
  | MongoDbLesson
  | GitLesson
  | AiLesson;

export interface LearnTopicBundle {
  topic: LearnTopicDefinition;
  weekId: number;
  lessons: LearnLesson[];
}

export interface LearnWeekBundle {
  weekId: number;
  slug: string;
  title: string;
  description: string;
  topics: LearnTopicBundle[];
}

export function lessonEntityId(lesson: Pick<BaseLesson, "weekId" | "topicSlug" | "id">): string {
  return `learn-w${lesson.weekId}-${lesson.topicSlug}-${lesson.id}`;
}

export function isJavaLike(lesson: LearnLesson): lesson is JavaLikeLesson {
  return ["java", "oop", "collections", "java8", "multithreading", "dsa", "jdbc", "spring-boot", "hibernate"].includes(
    lesson.category
  );
}
