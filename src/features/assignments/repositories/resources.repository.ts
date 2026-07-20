import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentResourceInsert,
  AssignmentResourceRow,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class AssignmentResourcesRepository {
  constructor(private readonly client: Client) {}

  async listByAssignmentId(
    assignmentId: string
  ): Promise<AssignmentResourceRow[]> {
    const { data, error } = await this.client
      .from("assignment_resources")
      .select("*")
      .eq("assignment_id", assignmentId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as AssignmentResourceRow[];
  }

  async create(
    payload: AssignmentResourceInsert
  ): Promise<AssignmentResourceRow> {
    const { data, error } = await this.client
      .from("assignment_resources")
      .insert(payload as never)
      .select("*")
      .single();

    if (error) throw error;
    return data as AssignmentResourceRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("assignment_resources")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
}
