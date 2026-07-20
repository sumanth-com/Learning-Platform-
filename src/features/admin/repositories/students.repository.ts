import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentSubmissionRow,
  Database,
  LessonProgressRow,
  ProfileRow,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type StudentProgressSummary = {
  completedLessons: number;
  totalProgressRows: number;
  submissions: number;
  approvedSubmissions: number;
};

export class AdminStudentsRepository {
  constructor(private readonly client: Client) {}

  async listStudents(
    query: AdminListQuery = {}
  ): Promise<PaginatedResult<ProfileRow>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = this.client
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.or(`full_name.ilike.${term},email.ilike.${term}`);
    }

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return {
      items: (data ?? []) as ProfileRow[],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async findById(id: string): Promise<ProfileRow | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as ProfileRow | null;
  }

  async countStudents(): Promise<number> {
    const { count, error } = await this.client
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");
    if (error) throw error;
    return count ?? 0;
  }

  async countSubmissions(): Promise<number> {
    const { count, error } = await this.client
      .from("assignment_submissions")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async listProgress(profileId: string): Promise<
    Array<
      LessonProgressRow & {
        lessons: { title: string; slug: string } | null;
      }
    >
  > {
    const { data, error } = await this.client
      .from("lesson_progress")
      .select("*, lessons(title, slug)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Array<
      LessonProgressRow & { lessons: { title: string; slug: string } | null }
    >;
  }

  async listSubmissions(profileId: string): Promise<
    Array<
      AssignmentSubmissionRow & {
        assignments: { title: string } | null;
      }
    >
  > {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .select("*, assignments(title)")
      .eq("profile_id", profileId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Array<
      AssignmentSubmissionRow & { assignments: { title: string } | null }
    >;
  }

  async getProgressSummary(
    profileId: string
  ): Promise<StudentProgressSummary> {
    const [progress, submissions] = await Promise.all([
      this.listProgress(profileId),
      this.listSubmissions(profileId),
    ]);
    return {
      completedLessons: progress.filter((p) => p.completed).length,
      totalProgressRows: progress.length,
      submissions: submissions.length,
      approvedSubmissions: submissions.filter((s) => s.status === "approved")
        .length,
    };
  }
}
