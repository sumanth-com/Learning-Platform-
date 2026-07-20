export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "instructor" | "admin";
export type CourseDifficulty = "beginner" | "intermediate" | "advanced";
export type LessonDifficulty = "beginner" | "intermediate" | "advanced";
export type ResourceType =
  | "article"
  | "docs"
  | "video"
  | "github"
  | "tool"
  | "pdf"
  | "other";

export type AssignmentDifficulty = "beginner" | "intermediate" | "advanced";
export type AssignmentResourceType =
  | "article"
  | "docs"
  | "video"
  | "github"
  | "figma"
  | "other";
export type SubmissionStatus =
  | "pending"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "approved";

export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  full_name?: string | null;
  email: string;
  avatar_url?: string | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  id?: string;
  full_name?: string | null;
  email?: string;
  avatar_url?: string | null;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  difficulty: CourseDifficulty;
  estimated_duration: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type CourseInsert = Partial<CourseRow> &
  Pick<CourseRow, "title" | "slug">;
export type CourseUpdate = Partial<CourseRow>;

export interface PhaseRow {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  created_at: string;
}

export type PhaseInsert = Partial<PhaseRow> &
  Pick<PhaseRow, "course_id" | "title" | "slug">;
export type PhaseUpdate = Partial<PhaseRow>;

export interface ModuleRow {
  id: string;
  phase_id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  estimated_duration: string;
  sort_order: number;
  created_at: string;
}

export type ModuleInsert = Partial<ModuleRow> &
  Pick<ModuleRow, "phase_id" | "title" | "slug">;
export type ModuleUpdate = Partial<ModuleRow>;

export interface LessonRow {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  duration_minutes: number;
  difficulty: LessonDifficulty;
  video_url: string | null;
  is_preview: boolean;
  learning_objectives: string[];
  sort_order: number;
  created_at: string;
}

export type LessonInsert = Partial<LessonRow> &
  Pick<LessonRow, "module_id" | "title" | "slug">;
export type LessonUpdate = Partial<LessonRow>;

export interface LessonResourceRow {
  id: string;
  lesson_id: string;
  title: string;
  type: ResourceType;
  url: string;
  created_at: string;
}

export type LessonResourceInsert = Partial<LessonResourceRow> &
  Pick<LessonResourceRow, "lesson_id" | "title" | "url">;
export type LessonResourceUpdate = Partial<LessonResourceRow>;

export interface LessonProgressRow {
  id: string;
  lesson_id: string;
  profile_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export type LessonProgressInsert = Partial<LessonProgressRow> &
  Pick<LessonProgressRow, "lesson_id" | "profile_id">;
export type LessonProgressUpdate = Partial<LessonProgressRow>;

export interface AssignmentRow {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: AssignmentDifficulty;
  estimated_time: string;
  total_marks: number;
  due_days: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type AssignmentInsert = Partial<AssignmentRow> &
  Pick<AssignmentRow, "lesson_id" | "title">;
export type AssignmentUpdate = Partial<AssignmentRow>;

export interface AssignmentResourceRow {
  id: string;
  assignment_id: string;
  title: string;
  type: AssignmentResourceType;
  url: string;
  created_at: string;
}

export type AssignmentResourceInsert = Partial<AssignmentResourceRow> &
  Pick<AssignmentResourceRow, "assignment_id" | "title" | "url">;
export type AssignmentResourceUpdate = Partial<AssignmentResourceRow>;

export interface AssignmentSubmissionRow {
  id: string;
  assignment_id: string;
  profile_id: string;
  github_url: string;
  demo_url: string | null;
  notes: string;
  status: SubmissionStatus;
  marks: number | null;
  feedback: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AssignmentSubmissionInsert = Partial<AssignmentSubmissionRow> &
  Pick<AssignmentSubmissionRow, "assignment_id" | "profile_id">;
export type AssignmentSubmissionUpdate = Partial<AssignmentSubmissionRow>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      courses: {
        Row: CourseRow;
        Insert: CourseInsert;
        Update: CourseUpdate;
        Relationships: [];
      };
      phases: {
        Row: PhaseRow;
        Insert: PhaseInsert;
        Update: PhaseUpdate;
        Relationships: [];
      };
      modules: {
        Row: ModuleRow;
        Insert: ModuleInsert;
        Update: ModuleUpdate;
        Relationships: [];
      };
      lessons: {
        Row: LessonRow;
        Insert: LessonInsert;
        Update: LessonUpdate;
        Relationships: [];
      };
      lesson_resources: {
        Row: LessonResourceRow;
        Insert: LessonResourceInsert;
        Update: LessonResourceUpdate;
        Relationships: [];
      };
      lesson_progress: {
        Row: LessonProgressRow;
        Insert: LessonProgressInsert;
        Update: LessonProgressUpdate;
        Relationships: [];
      };
      assignments: {
        Row: AssignmentRow;
        Insert: AssignmentInsert;
        Update: AssignmentUpdate;
        Relationships: [];
      };
      assignment_resources: {
        Row: AssignmentResourceRow;
        Insert: AssignmentResourceInsert;
        Update: AssignmentResourceUpdate;
        Relationships: [];
      };
      assignment_submissions: {
        Row: AssignmentSubmissionRow;
        Insert: AssignmentSubmissionInsert;
        Update: AssignmentSubmissionUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
