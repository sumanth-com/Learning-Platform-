export type Difficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "pending" | "completed" | "in-progress";
export type ProjectStatus = "not-started" | "in-progress" | "completed";

export interface Subtopic {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
  difficulty: Difficulty;
  notes: string;
}

export interface Topic {
  id: string;
  weekId: number;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
  difficulty: Difficulty;
  notes: string;
  subtopics: Subtopic[];
}

export interface DailyPlan {
  day: string;
  tasks: string[];
  completed: boolean[];
}

export interface PracticeProblem {
  id: string;
  weekId: number;
  title: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  bookmarked: boolean;
  topic: string;
  leetcodeUrl?: string;
}

export interface GitHubChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Project {
  id: string;
  weekId: number;
  title: string;
  description: string;
  features: string[];
  requirements: string[];
  bonusFeatures: string[];
  githubChecklist: GitHubChecklistItem[];
  status: ProjectStatus;
  progress: number;
}

export interface AISkill {
  id: string;
  weekId: number;
  title: string;
  description: string;
  tools: string[];
  exercises: { id: string; title: string; completed: boolean }[];
  promptExercises: { id: string; prompt: string; completed: boolean }[];
  completed: boolean;
}

export type InterviewCategory =
  | "Java"
  | "OOP"
  | "Collections"
  | "Java 8"
  | "SQL"
  | "JDBC"
  | "Spring Boot"
  | "REST APIs"
  | "Security"
  | "Hibernate"
  | "MongoDB"
  | "AI";

export interface InterviewQuestion {
  id: string;
  weekId: number;
  category: InterviewCategory;
  question: string;
  answer: string;
  completed: boolean;
  bookmarked: boolean;
  notes: string;
}

export interface WeeklyQuiz {
  id: string;
  weekId: number;
  title: string;
  questions: { id: string; question: string; completed: boolean }[];
  completed: boolean;
  score?: number;
}

export interface Week {
  id: number;
  title: string;
  goal: string;
  description: string;
  estimatedHours: number;
  difficulty: Difficulty;
  locked: boolean;
  completed: boolean;
  notes: string;
  dailyPlanner: DailyPlan[];
  topics: Topic[];
  practiceProblems: PracticeProblem[];
  projects: Project[];
  aiSkill: AISkill;
  interviewQuestions: InterviewQuestion[];
  quiz: WeeklyQuiz;
}

export interface UserProfile {
  name: string;
  avatar: string;
  currentWeek: number;
  streak: number;
  totalStudyHours: number;
  lastActiveDate: string;
  resumeReadinessScore: number;
  githubProgress: number;
}

export interface StudySession {
  date: string;
  hours: number;
  weekId: number;
}

export interface AppNote {
  id: string;
  title: string;
  content: string;
  weekId?: number;
  updatedAt: string;
}

export interface ProgressState {
  weeks: Week[];
  profile: UserProfile;
  studySessions: StudySession[];
  notes: AppNote[];
  todayGoal: string;
  todayGoalCompleted: boolean;
}
