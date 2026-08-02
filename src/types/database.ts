export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "super_admin";

export type SeatRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "contacted"
  | "joined"
  | "inactive";

export type ApplicantStatus =
  | "student"
  | "working_professional"
  | "career_switcher";

export interface SeatRequestRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  applicant_status: ApplicantStatus | null;
  college_name: string | null;
  message: string | null;
  notes: string | null;
  source: string | null;
  status: SeatRequestStatus;
  approved_by: string | null;
  approved_at: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeatInvitationRow {
  id: string;
  seat_request_id: string;
  user_id: string;
  email: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}
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
  headline?: string | null;
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

export interface LearnerStatsRow {
  profile_id: string;
  total_xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  total_study_hours: number;
  current_week: number;
  created_at: string;
  updated_at: string;
}

export interface XpLedgerRow {
  id: string;
  profile_id: string;
  amount: number;
  source_key: string;
  reason: string;
  created_at: string;
}

export interface EntityProgressRow {
  id: string;
  profile_id: string;
  entity_id: string;
  completed: boolean;
  completed_at: string | null;
  xp_earned: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleGateRow {
  id: string;
  profile_id: string;
  module: string;
  unlocked_week_ids: number[];
  completed_week_ids: number[];
  updated_at: string;
}

export interface LearnerNoteRow {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  week_id: number | null;
  pinned: boolean;
  accent: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntityNoteRow {
  id: string;
  profile_id: string;
  entity_id: string;
  note: string;
  updated_at: string;
}

export interface WeekNoteRow {
  id: string;
  profile_id: string;
  week_id: number;
  note: string;
  updated_at: string;
}

export interface LearnerBookmarkRow {
  id: string;
  profile_id: string;
  entity_id: string;
  created_at: string;
}

export interface ProjectProgressRow {
  id: string;
  profile_id: string;
  project_id: string;
  progress: number;
  status: string;
  github_link: string;
  notes: string;
  updated_at: string;
}

export interface AssignmentLocalMetaRow {
  id: string;
  profile_id: string;
  catalog_id: string;
  status: string;
  github_url: string;
  live_url: string;
  screenshots: string;
  notes: string;
  reflection: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  feedback: string | null;
  marks: number | null;
  updated_at: string;
}

export interface LearnerResumeRow {
  profile_id: string;
  module: string;
  week_id: number;
  title: string;
  subtitle: string | null;
  href: string;
  topic_slug: string | null;
  topic_title: string | null;
  lesson_id: string | null;
  updated_at: string;
}

export interface LearnerPreferencesRow {
  profile_id: string;
  notifications_muted: boolean;
  notification_sound: string;
  notify_learning: boolean;
  notify_mentor: boolean;
  notify_achievements: boolean;
  celebrations_enabled: boolean;
  today_goal: string;
  today_goal_date: string | null;
  today_goal_completed: boolean;
  celebrated_week_ids: number[];
  scroll_positions: Json;
  github_repo_links: Json;
  updated_at: string;
}

export interface LearnerNotificationRow {
  id: string;
  profile_id: string;
  channel: "learning" | "mentor" | "achievements";
  title: string;
  body: string;
  href: string | null;
  kind: string;
  meta: Json;
  read: boolean;
  created_at: string;
}

export interface AchievementRow {
  id: string;
  profile_id: string;
  achievement_key: string;
  title: string;
  awarded_at: string;
  meta: Json;
}

export interface CertAttemptRow {
  id: string;
  profile_id: string;
  certification_id: string;
  payload: Json;
  status: string;
  score: number | null;
  updated_at: string;
}

export interface HubLibraryRow {
  profile_id: string;
  bookmarks: string[];
  liked: string[];
  recent: Json;
  updated_at: string;
}

export interface StudySessionRow {
  id: string;
  profile_id: string;
  session_date: string;
  hours: number;
  week_id: number;
  created_at: string;
}

export interface AuditEventRow {
  id: string;
  profile_id: string | null;
  actor_id: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  payload: Json;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      seat_requests: {
        Row: SeatRequestRow;
        Insert: Partial<SeatRequestRow> &
          Pick<SeatRequestRow, "name" | "email">;
        Update: Partial<SeatRequestRow>;
        Relationships: [];
      };
      seat_invitations: {
        Row: SeatInvitationRow;
        Insert: Partial<SeatInvitationRow> &
          Pick<
            SeatInvitationRow,
            "seat_request_id" | "user_id" | "email" | "token_hash" | "expires_at"
          >;
        Update: Partial<SeatInvitationRow>;
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
      learner_stats: {
        Row: LearnerStatsRow;
        Insert: Partial<LearnerStatsRow> & Pick<LearnerStatsRow, "profile_id">;
        Update: Partial<LearnerStatsRow>;
        Relationships: [];
      };
      xp_ledger: {
        Row: XpLedgerRow;
        Insert: Pick<XpLedgerRow, "profile_id" | "amount" | "source_key"> &
          Partial<XpLedgerRow>;
        Update: never;
        Relationships: [];
      };
      entity_progress: {
        Row: EntityProgressRow;
        Insert: Pick<EntityProgressRow, "profile_id" | "entity_id"> &
          Partial<EntityProgressRow>;
        Update: Partial<EntityProgressRow>;
        Relationships: [];
      };
      module_gates: {
        Row: ModuleGateRow;
        Insert: Pick<ModuleGateRow, "profile_id" | "module"> &
          Partial<ModuleGateRow>;
        Update: Partial<ModuleGateRow>;
        Relationships: [];
      };
      learner_notes: {
        Row: LearnerNoteRow;
        Insert: Pick<LearnerNoteRow, "profile_id"> & Partial<LearnerNoteRow>;
        Update: Partial<LearnerNoteRow>;
        Relationships: [];
      };
      entity_notes: {
        Row: EntityNoteRow;
        Insert: Pick<EntityNoteRow, "profile_id" | "entity_id"> &
          Partial<EntityNoteRow>;
        Update: Partial<EntityNoteRow>;
        Relationships: [];
      };
      week_notes: {
        Row: WeekNoteRow;
        Insert: Pick<WeekNoteRow, "profile_id" | "week_id"> & Partial<WeekNoteRow>;
        Update: Partial<WeekNoteRow>;
        Relationships: [];
      };
      learner_bookmarks: {
        Row: LearnerBookmarkRow;
        Insert: Pick<LearnerBookmarkRow, "profile_id" | "entity_id"> &
          Partial<LearnerBookmarkRow>;
        Update: Partial<LearnerBookmarkRow>;
        Relationships: [];
      };
      project_progress: {
        Row: ProjectProgressRow;
        Insert: Pick<ProjectProgressRow, "profile_id" | "project_id"> &
          Partial<ProjectProgressRow>;
        Update: Partial<ProjectProgressRow>;
        Relationships: [];
      };
      assignment_local_meta: {
        Row: AssignmentLocalMetaRow;
        Insert: Pick<AssignmentLocalMetaRow, "profile_id" | "catalog_id"> &
          Partial<AssignmentLocalMetaRow>;
        Update: Partial<AssignmentLocalMetaRow>;
        Relationships: [];
      };
      learner_resume: {
        Row: LearnerResumeRow;
        Insert: Pick<LearnerResumeRow, "profile_id"> & Partial<LearnerResumeRow>;
        Update: Partial<LearnerResumeRow>;
        Relationships: [];
      };
      learner_preferences: {
        Row: LearnerPreferencesRow;
        Insert: Pick<LearnerPreferencesRow, "profile_id"> &
          Partial<LearnerPreferencesRow>;
        Update: Partial<LearnerPreferencesRow>;
        Relationships: [];
      };
      learner_notifications: {
        Row: LearnerNotificationRow;
        Insert: Pick<
          LearnerNotificationRow,
          "profile_id" | "channel" | "title"
        > &
          Partial<LearnerNotificationRow>;
        Update: Partial<LearnerNotificationRow>;
        Relationships: [];
      };
      achievements: {
        Row: AchievementRow;
        Insert: Pick<AchievementRow, "profile_id" | "achievement_key"> &
          Partial<AchievementRow>;
        Update: Partial<AchievementRow>;
        Relationships: [];
      };
      cert_attempts: {
        Row: CertAttemptRow;
        Insert: Pick<CertAttemptRow, "profile_id" | "certification_id"> &
          Partial<CertAttemptRow>;
        Update: Partial<CertAttemptRow>;
        Relationships: [];
      };
      hub_library: {
        Row: HubLibraryRow;
        Insert: Pick<HubLibraryRow, "profile_id"> & Partial<HubLibraryRow>;
        Update: Partial<HubLibraryRow>;
        Relationships: [];
      };
      study_sessions: {
        Row: StudySessionRow;
        Insert: Pick<StudySessionRow, "profile_id" | "session_date"> &
          Partial<StudySessionRow>;
        Update: Partial<StudySessionRow>;
        Relationships: [];
      };
      audit_events: {
        Row: AuditEventRow;
        Insert: Pick<AuditEventRow, "event_type"> & Partial<AuditEventRow>;
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      verify_certificate: {
        Args: { cert_id: string };
        Returns: PublicCertificateRow[];
      };
      ensure_learner_workspace: {
        Args: { p_profile_id?: string };
        Returns: null;
      };
      touch_daily_activity: {
        Args: Record<string, never>;
        Returns: number;
      };
      complete_entity: {
        Args: {
          p_entity_id: string;
          p_xp?: number;
          p_source_key?: string;
          p_completed?: boolean;
        };
        Returns: Json;
      };
      submit_and_complete_journey_assignment: {
        Args: {
          p_catalog_id: string;
          p_assignment_number: number;
          p_assignment_title: string;
          p_module_slug: string;
          p_module_title: string;
          p_student_name: string;
          p_student_email: string;
          p_github_url?: string;
          p_live_url?: string;
          p_screenshots?: string;
          p_notes?: string;
          p_reflection?: string;
          p_xp?: number;
        };
        Returns: Json;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
