import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonProgressRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export class ProgressRepository {
  constructor(private readonly client: Client) {}

  async listCompletedLessonIds(profileId: string): Promise<Set<string>> {
    const { data, error } = await this.client
      .from("lesson_progress")
      .select("*")
      .eq("profile_id", profileId)
      .eq("completed", true);

    if (error) throw error;
    const rows = (data ?? []) as LessonProgressRow[];
    return new Set(rows.map((row) => row.lesson_id));
  }

  async findByProfileAndLesson(
    profileId: string,
    lessonId: string
  ): Promise<LessonProgressRow | null> {
    const { data, error } = await this.client
      .from("lesson_progress")
      .select("*")
      .eq("profile_id", profileId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) throw error;
    return data as LessonProgressRow | null;
  }

  async upsertCompletion(
    profileId: string,
    lessonId: string,
    completed: boolean
  ): Promise<LessonProgressRow> {
    const payload = {
      profile_id: profileId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    };

    const { data, error } = await this.client
      .from("lesson_progress")
      .upsert(payload as never, { onConflict: "lesson_id,profile_id" })
      .select("*")
      .single();

    if (error) throw error;
    return data as LessonProgressRow;
  }
}
