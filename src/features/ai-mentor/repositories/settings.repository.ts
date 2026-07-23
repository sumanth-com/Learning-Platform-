import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiMentorSettingsInsert,
  AiMentorSettingsRow,
  AiMentorSettingsUpdate,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class MentorSettingsRepository {
  constructor(private readonly client: Client) {}

  async get(profileId: string): Promise<AiMentorSettingsRow | null> {
    const { data, error } = await this.client
      .from("ai_mentor_settings")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data as AiMentorSettingsRow | null;
  }

  async upsert(
    payload: AiMentorSettingsInsert
  ): Promise<AiMentorSettingsRow> {
    const { data, error } = await this.client
      .from("ai_mentor_settings")
      .upsert(payload as never, { onConflict: "profile_id" })
      .select("*")
      .single();
    if (error) throw error;
    return data as AiMentorSettingsRow;
  }

  async update(
    profileId: string,
    payload: AiMentorSettingsUpdate
  ): Promise<AiMentorSettingsRow> {
    const { data, error } = await this.client
      .from("ai_mentor_settings")
      .update(payload as never)
      .eq("profile_id", profileId)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiMentorSettingsRow;
  }
}
