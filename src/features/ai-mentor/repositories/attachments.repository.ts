import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiAttachmentInsert,
  AiAttachmentRow,
  Database,
} from "@/types/database";

type Client = SupabaseClient<Database>;

export const AI_MENTOR_ATTACHMENT_BUCKET = "ai-mentor-attachments";
export const AI_MENTOR_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const AI_MENTOR_MAX_ATTACHMENTS = 6;

export const AI_MENTOR_ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "pdf",
  "txt",
  "md",
  "docx",
  "csv",
  "json",
  "js",
  "ts",
  "tsx",
  "jsx",
  "py",
  "java",
  "cpp",
  "c",
  "h",
  "zip",
] as const;

export class AttachmentsRepository {
  constructor(private readonly client: Client) {}

  async create(payload: AiAttachmentInsert): Promise<AiAttachmentRow> {
    const { data, error } = await this.client
      .from("ai_attachments")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AiAttachmentRow;
  }

  async listByIds(
    ids: string[],
    profileId: string
  ): Promise<AiAttachmentRow[]> {
    if (ids.length === 0) return [];
    const { data, error } = await this.client
      .from("ai_attachments")
      .select("*")
      .eq("profile_id", profileId)
      .in("id", ids);
    if (error) throw error;
    return (data ?? []) as AiAttachmentRow[];
  }

  async bindToMessage(
    ids: string[],
    messageId: string,
    profileId: string
  ): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await this.client
      .from("ai_attachments")
      .update({ message_id: messageId } as never)
      .eq("profile_id", profileId)
      .in("id", ids);
    if (error) throw error;
  }

  async delete(id: string, profileId: string): Promise<void> {
    const { data, error } = await this.client
      .from("ai_attachments")
      .delete()
      .eq("id", id)
      .eq("profile_id", profileId)
      .select("storage_path")
      .maybeSingle();
    if (error) throw error;
    const path = (data as { storage_path?: string | null } | null)?.storage_path;
    if (path) {
      await this.client.storage.from(AI_MENTOR_ATTACHMENT_BUCKET).remove([path]);
    }
  }
}
