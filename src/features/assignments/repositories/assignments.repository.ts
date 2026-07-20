import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentInsert,
  AssignmentRow,
  AssignmentUpdate,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class AssignmentsRepository {
  constructor(private readonly client: Client) {}

  async findById(id: string): Promise<AssignmentRow | null> {
    const { data, error } = await this.client
      .from("assignments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as AssignmentRow | null;
  }

  async listByLessonId(
    lessonId: string,
    options?: { publishedOnly?: boolean }
  ): Promise<AssignmentRow[]> {
    let query = this.client
      .from("assignments")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });

    if (options?.publishedOnly) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as AssignmentRow[];
  }

  async create(payload: AssignmentInsert): Promise<AssignmentRow> {
    const { data, error } = await this.client
      .from("assignments")
      .insert(payload as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as AssignmentRow;
  }

  async update(id: string, payload: AssignmentUpdate): Promise<AssignmentRow> {
    const { data, error } = await this.client
      .from("assignments")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as AssignmentRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("assignments").delete().eq("id", id);
    if (error) throw error;
  }

  async setPublished(id: string, isPublished: boolean): Promise<AssignmentRow> {
    return this.update(id, { is_published: isPublished });
  }
}
