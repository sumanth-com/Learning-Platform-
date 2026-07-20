import type { SupabaseClient } from "@supabase/supabase-js";
import type { CourseRow, Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export class CoursesRepository {
  constructor(private readonly client: Client) {}

  async findPublishedBySlug(slug: string): Promise<CourseRow | null> {
    const { data, error } = await this.client
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findById(courseId: string): Promise<CourseRow | null> {
    const { data, error } = await this.client
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
