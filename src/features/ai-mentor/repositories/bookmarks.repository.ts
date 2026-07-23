import type { SupabaseClient } from "@supabase/supabase-js";
import type { AiBookmarkInsert, AiBookmarkRow, Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export class BookmarksRepository {
  constructor(private readonly client: Client) {}

  async listForUser(profileId: string): Promise<AiBookmarkRow[]> {
    const { data, error } = await this.client
      .from("ai_bookmarks")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as AiBookmarkRow[];
  }

  async create(payload: AiBookmarkInsert): Promise<AiBookmarkRow> {
    const { data, error } = await this.client
      .from("ai_bookmarks")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiBookmarkRow;
  }

  async delete(id: string, profileId: string): Promise<void> {
    const { error } = await this.client
      .from("ai_bookmarks")
      .delete()
      .eq("id", id)
      .eq("profile_id", profileId);
    if (error) throw error;
  }
}
