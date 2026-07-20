import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PhaseRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export class PhasesRepository {
  constructor(private readonly client: Client) {}

  async findById(phaseId: string): Promise<PhaseRow | null> {
    const { data, error } = await this.client
      .from("phases")
      .select("*")
      .eq("id", phaseId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async listByCourseId(courseId: string): Promise<PhaseRow[]> {
    const { data, error } = await this.client
      .from("phases")
      .select("*")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }
}
