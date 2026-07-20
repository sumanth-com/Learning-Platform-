import type {
  AssignmentDifficulty,
  AssignmentResourceRow,
  AssignmentRow,
  AssignmentSubmissionRow,
  LessonRow,
  SubmissionStatus,
  UserRole,
} from "@/types/database";

export type { AssignmentDifficulty, SubmissionStatus };

export const ASSIGNMENT_ROUTES = {
  detail: (id: string) => `/assignment/${id}`,
} as const;

export const ASSIGNMENT_PROTECTED_ROUTES = ["/assignment"] as const;

export const SUBMISSION_STATUSES = [
  "pending",
  "submitted",
  "under_review",
  "revision_requested",
  "approved",
] as const;

export const MENTOR_ROLES: UserRole[] = ["instructor", "admin"];

export function isMentorRole(role: UserRole | null | undefined): boolean {
  return role === "instructor" || role === "admin";
}

export function canStudentEditSubmission(status: SubmissionStatus): boolean {
  return (
    status === "pending" ||
    status === "submitted" ||
    status === "revision_requested"
  );
}

export function computeDeadline(
  createdAt: string,
  dueDays: number
): Date {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + dueDays);
  return date;
}

export interface AssignmentSummary {
  id: string;
  title: string;
  description: string;
  difficulty: AssignmentDifficulty;
  estimatedTime: string;
  totalMarks: number;
  dueDays: number;
  isPublished: boolean;
  submissionStatus: SubmissionStatus | null;
}

export interface AssignmentDetail {
  assignment: AssignmentRow;
  resources: AssignmentResourceRow[];
  lesson: Pick<LessonRow, "id" | "title" | "slug">;
  deadline: Date;
  submission: AssignmentSubmissionRow | null;
  submissions: AssignmentSubmissionRow[];
}

export interface CreateAssignmentInput {
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: AssignmentDifficulty;
  estimatedTime: string;
  totalMarks: number;
  dueDays: number;
  isPublished?: boolean;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string;
  instructions?: string;
  difficulty?: AssignmentDifficulty;
  estimatedTime?: string;
  totalMarks?: number;
  dueDays?: number;
  isPublished?: boolean;
}

export interface SubmitAssignmentInput {
  githubUrl: string;
  demoUrl?: string;
  notes?: string;
}

export interface ReviewSubmissionInput {
  submissionId: string;
  status: Extract<
    SubmissionStatus,
    "under_review" | "revision_requested" | "approved"
  >;
  marks?: number | null;
  feedback?: string | null;
}
