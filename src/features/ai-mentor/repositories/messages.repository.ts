import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiMessageInsert,
  AiMessageRow,
  AiMessageUpdate,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export class MessagesRepository {
  constructor(private readonly client: Client) {}

  async listForConversation(
    conversationId: string,
    profileId: string
  ): Promise<AiMessageRow[]> {
    const { data, error } = await this.client
      .from("ai_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as AiMessageRow[];
  }

  async findById(
    id: string,
    profileId: string
  ): Promise<AiMessageRow | null> {
    const { data, error } = await this.client
      .from("ai_messages")
      .select("*")
      .eq("id", id)
      .eq("profile_id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data as AiMessageRow | null;
  }

  async create(payload: AiMessageInsert): Promise<AiMessageRow> {
    const { data, error } = await this.client
      .from("ai_messages")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiMessageRow;
  }

  async update(
    id: string,
    profileId: string,
    payload: AiMessageUpdate
  ): Promise<AiMessageRow> {
    const { data, error } = await this.client
      .from("ai_messages")
      .update(payload as never)
      .eq("id", id)
      .eq("profile_id", profileId)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiMessageRow;
  }

  async delete(id: string, profileId: string): Promise<void> {
    const { error } = await this.client
      .from("ai_messages")
      .delete()
      .eq("id", id)
      .eq("profile_id", profileId);
    if (error) throw error;
  }

  async deleteAfter(
    conversationId: string,
    profileId: string,
    afterCreatedAt: string
  ): Promise<void> {
    const { error } = await this.client
      .from("ai_messages")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("profile_id", profileId)
      .gt("created_at", afterCreatedAt);
    if (error) throw error;
  }
}
