import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonResourceRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export class LessonResourcesRepository {
  constructor(private readonly client: Client) {}

  async listByLessonId(lessonId: string): Promise<LessonResourceRow[]> {
    const { data, error } = await this.client
      .from("lesson_resources")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as LessonResourceRow[];
  }
}
