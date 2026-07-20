import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentSubmissionInsert,
  AssignmentSubmissionRow,
  AssignmentSubmissionUpdate,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class SubmissionsRepository {
  constructor(private readonly client: Client) {}

  async findByAssignmentAndProfile(
    assignmentId: string,
    profileId: string
  ): Promise<AssignmentSubmissionRow | null> {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) throw error;
    return data as AssignmentSubmissionRow | null;
  }

  async listByAssignmentId(
    assignmentId: string
  ): Promise<AssignmentSubmissionRow[]> {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .order("submitted_at", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []) as AssignmentSubmissionRow[];
  }

  async findById(id: string): Promise<AssignmentSubmissionRow | null> {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as AssignmentSubmissionRow | null;
  }

  async upsert(
    payload: AssignmentSubmissionInsert
  ): Promise<AssignmentSubmissionRow> {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .upsert(payload as never, { onConflict: "assignment_id,profile_id" })
      .select("*")
      .single();

    if (error) throw error;
    return data as AssignmentSubmissionRow;
  }

  async update(
    id: string,
    payload: AssignmentSubmissionUpdate
  ): Promise<AssignmentSubmissionRow> {
    const { data, error } = await this.client
      .from("assignment_submissions")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as AssignmentSubmissionRow;
  }
}
