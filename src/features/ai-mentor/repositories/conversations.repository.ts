import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiConversationInsert,
  AiConversationRow,
  AiConversationUpdate,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class ConversationsRepository {
  constructor(private readonly client: Client) {}

  async listForUser(
    profileId: string,
    options?: { q?: string; includeArchived?: boolean }
  ): Promise<AiConversationRow[]> {
    let query = this.client
      .from("ai_conversations")
      .select("*")
      .eq("profile_id", profileId)
      .order("pinned", { ascending: false })
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (!options?.includeArchived) {
      query = query.eq("archived", false);
    }

    if (options?.q?.trim()) {
      query = query.ilike("title", `%${options.q.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as AiConversationRow[];
  }

  async findByIdForUser(
    id: string,
    profileId: string
  ): Promise<AiConversationRow | null> {
    const { data, error } = await this.client
      .from("ai_conversations")
      .select("*")
      .eq("id", id)
      .eq("profile_id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data as AiConversationRow | null;
  }

  async create(payload: AiConversationInsert): Promise<AiConversationRow> {
    const { data, error } = await this.client
      .from("ai_conversations")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiConversationRow;
  }

  async update(
    id: string,
    profileId: string,
    payload: AiConversationUpdate
  ): Promise<AiConversationRow> {
    const { data, error } = await this.client
      .from("ai_conversations")
      .update(payload as never)
      .eq("id", id)
      .eq("profile_id", profileId)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiConversationRow;
  }

  async delete(id: string, profileId: string): Promise<void> {
    const { error } = await this.client
      .from("ai_conversations")
      .delete()
      .eq("id", id)
      .eq("profile_id", profileId);
    if (error) throw error;
  }
}
