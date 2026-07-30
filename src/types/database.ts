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

export interface JourneyAssignmentSubmissionRow {
  id: string;
  catalog_id: string;
  assignment_number: number;
  assignment_title: string;
  module_slug: string;
  module_title: string;
  profile_id: string;
  student_name: string;
  student_email: string;
  github_url: string;
  live_url: string;
  screenshots: string;
  notes: string;
  reflection: string;
  status: SubmissionStatus;
  marks: number | null;
  feedback: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type JourneyAssignmentSubmissionInsert =
  Partial<JourneyAssignmentSubmissionRow> &
    Pick<JourneyAssignmentSubmissionRow, "catalog_id" | "profile_id">;
export type JourneyAssignmentSubmissionUpdate =
  Partial<JourneyAssignmentSubmissionRow>;

export type AiMessageRole = "user" | "assistant" | "system";
export type AiMessageStatus =
  | "pending"
  | "streaming"
  | "complete"
  | "error"
  | "cancelled";

export interface AiConversationRow {
  id: string;
  profile_id: string;
  title: string;
  pinned: boolean;
  archived: boolean;
  favorited: boolean;
  context: Json;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AiConversationInsert = Partial<AiConversationRow> &
  Pick<AiConversationRow, "profile_id">;
export type AiConversationUpdate = Partial<AiConversationRow>;

export interface AiMessageRow {
  id: string;
  conversation_id: string;
  profile_id: string;
  role: AiMessageRole;
  content: string;
  status: AiMessageStatus;
  model: string | null;
  error: string | null;
  token_input: number | null;
  token_output: number | null;
  created_at: string;
  updated_at: string;
}

export type AiMessageInsert = Partial<AiMessageRow> &
  Pick<AiMessageRow, "conversation_id" | "profile_id" | "role">;
export type AiMessageUpdate = Partial<AiMessageRow>;

export interface AiAttachmentRow {
  id: string;
  profile_id: string;
  conversation_id: string;
  message_id: string | null;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string | null;
  created_at: string;
}

export type AiAttachmentInsert = Partial<AiAttachmentRow> &
  Pick<AiAttachmentRow, "profile_id" | "conversation_id" | "file_name">;

export interface AiBookmarkRow {
  id: string;
  profile_id: string;
  conversation_id: string;
  message_id: string | null;
  label: string;
  snippet: string;
  created_at: string;
}

export type AiBookmarkInsert = Partial<AiBookmarkRow> &
  Pick<AiBookmarkRow, "profile_id" | "conversation_id">;

export interface AiSavedPromptRow {
  id: string;
  profile_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export type AiSavedPromptInsert = Partial<AiSavedPromptRow> &
  Pick<AiSavedPromptRow, "profile_id" | "title" | "body">;
export type AiSavedPromptUpdate = Partial<AiSavedPromptRow>;

export interface AiMentorSettingsRow {
  profile_id: string;
  preferred_provider: string;
  preferred_model: string | null;
  temperature: number;
  system_extra: string;
  created_at: string;
  updated_at: string;
}

export type AiMentorSettingsInsert = Partial<AiMentorSettingsRow> &
  Pick<AiMentorSettingsRow, "profile_id">;
export type AiMentorSettingsUpdate = Partial<AiMentorSettingsRow>;

export type CertificateRow = {
  id: string;
  profile_id: string;
  certification_id: string;
  recipient_name: string;
  title: string;
  technology: string;
  level: "basic" | "intermediate";
  score: number;
  issued_at: string;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CertificateInsert = Omit<
  CertificateRow,
  "issued_at" | "revoked_at" | "created_at" | "updated_at"
> &
  Partial<
    Pick<
      CertificateRow,
      "issued_at" | "revoked_at" | "created_at" | "updated_at"
    >
  >;
export type CertificateUpdate = Partial<CertificateInsert>;

export type PublicCertificateRow = Pick<
  CertificateRow,
  | "id"
  | "certification_id"
  | "recipient_name"
  | "title"
  | "technology"
  | "level"
  | "score"
  | "issued_at"
>;

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
      journey_assignment_submissions: {
        Row: JourneyAssignmentSubmissionRow;
        Insert: JourneyAssignmentSubmissionInsert;
        Update: JourneyAssignmentSubmissionUpdate;
        Relationships: [];
      };
      ai_conversations: {
        Row: AiConversationRow;
        Insert: AiConversationInsert;
        Update: AiConversationUpdate;
        Relationships: [];
      };
      ai_messages: {
        Row: AiMessageRow;
        Insert: AiMessageInsert;
        Update: AiMessageUpdate;
        Relationships: [];
      };
      ai_attachments: {
        Row: AiAttachmentRow;
        Insert: AiAttachmentInsert;
        Update: Partial<AiAttachmentRow>;
        Relationships: [];
      };
      ai_bookmarks: {
        Row: AiBookmarkRow;
        Insert: AiBookmarkInsert;
        Update: Partial<AiBookmarkRow>;
        Relationships: [];
      };
      ai_saved_prompts: {
        Row: AiSavedPromptRow;
        Insert: AiSavedPromptInsert;
        Update: AiSavedPromptUpdate;
        Relationships: [];
      };
      ai_mentor_settings: {
        Row: AiMentorSettingsRow;
        Insert: AiMentorSettingsInsert;
        Update: AiMentorSettingsUpdate;
        Relationships: [];
      };
      certificates: {
        Row: CertificateRow;
        Insert: CertificateInsert;
        Update: CertificateUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      verify_certificate: {
        Args: { cert_id: string };
        Returns: PublicCertificateRow[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
