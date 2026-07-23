import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  JourneyAssignmentSubmissionInsert,
  JourneyAssignmentSubmissionRow,
  JourneyAssignmentSubmissionUpdate,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class JourneySubmissionsRepository {
  constructor(private readonly client: Client) {}

  async upsert(
    payload: JourneyAssignmentSubmissionInsert
  ): Promise<JourneyAssignmentSubmissionRow> {
    const { data, error } = await this.client
      .from("journey_assignment_submissions")
      .upsert(payload as never, { onConflict: "catalog_id,profile_id" })
      .select("*")
      .single();

    if (error) throw error;
    return data as JourneyAssignmentSubmissionRow;
  }

  async listForAdmin(options?: {
    status?: string;
    q?: string;
    limit?: number;
  }): Promise<JourneyAssignmentSubmissionRow[]> {
    let query = this.client
      .from("journey_assignment_submissions")
      .select("*")
      .order("submitted_at", { ascending: false, nullsFirst: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status as never);
    }

    if (options?.q?.trim()) {
      const safe = options.q.trim().replace(/[%_,.()]/g, " ").trim();
      if (safe) {
        const q = `%${safe}%`;
        query = query.or(
          `assignment_title.ilike.${q},student_name.ilike.${q},student_email.ilike.${q},catalog_id.ilike.${q}`
        );
      }
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as JourneyAssignmentSubmissionRow[];
  }

  async findById(id: string): Promise<JourneyAssignmentSubmissionRow | null> {
    const { data, error } = await this.client
      .from("journey_assignment_submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as JourneyAssignmentSubmissionRow | null;
  }

  async findByCatalogAndProfile(
    catalogId: string,
    profileId: string
  ): Promise<JourneyAssignmentSubmissionRow | null> {
    const { data, error } = await this.client
      .from("journey_assignment_submissions")
      .select("*")
      .eq("catalog_id", catalogId)
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) throw error;
    return data as JourneyAssignmentSubmissionRow | null;
  }

  async update(
    id: string,
    payload: JourneyAssignmentSubmissionUpdate
  ): Promise<JourneyAssignmentSubmissionRow> {
    const { data, error } = await this.client
      .from("journey_assignment_submissions")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as JourneyAssignmentSubmissionRow;
  }
}
