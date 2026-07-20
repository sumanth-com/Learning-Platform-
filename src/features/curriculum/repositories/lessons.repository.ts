import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export class LessonsRepository {
  constructor(private readonly client: Client) {}

  async listByModuleIds(moduleIds: string[]): Promise<LessonRow[]> {
    if (moduleIds.length === 0) return [];

    const { data, error } = await this.client
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async findById(lessonId: string): Promise<LessonRow | null> {
    const { data, error } = await this.client
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string): Promise<LessonRow | null> {
    const { data, error } = await this.client
      .from("lessons")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
