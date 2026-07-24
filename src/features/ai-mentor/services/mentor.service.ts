import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiConversationRow,
  AiMessageRow,
  AiMentorSettingsRow,
  Database,
  Json,
} from "@/types/database";
import { ConversationsRepository } from "@/features/ai-mentor/repositories/conversations.repository";
import { MessagesRepository } from "@/features/ai-mentor/repositories/messages.repository";
import { MentorSettingsRepository } from "@/features/ai-mentor/repositories/settings.repository";
import { BookmarksRepository } from "@/features/ai-mentor/repositories/bookmarks.repository";
import { AttachmentsRepository } from "@/features/ai-mentor/repositories/attachments.repository";
import type { LearningContext } from "@/features/ai-mentor/types";

type Client = SupabaseClient<Database>;

export class MentorService {
  private readonly conversations: ConversationsRepository;
  private readonly messages: MessagesRepository;
  private readonly settings: MentorSettingsRepository;
  private readonly bookmarks: BookmarksRepository;
  readonly attachments: AttachmentsRepository;

  constructor(client: Client) {
    this.conversations = new ConversationsRepository(client);
    this.messages = new MessagesRepository(client);
    this.settings = new MentorSettingsRepository(client);
    this.bookmarks = new BookmarksRepository(client);
    this.attachments = new AttachmentsRepository(client);
  }

  listConversations(profileId: string, q?: string) {
    return this.conversations.listForUser(profileId, { q });
  }

  getConversation(id: string, profileId: string) {
    return this.conversations.findByIdForUser(id, profileId);
  }

  async createConversation(
    profileId: string,
    options?: { title?: string; context?: LearningContext }
  ): Promise<AiConversationRow> {
    return this.conversations.create({
      profile_id: profileId,
      title: options?.title?.trim() || "New chat",
      context: (options?.context ?? {}) as Json,
    });
  }

  rename(id: string, profileId: string, title: string) {
    return this.conversations.update(id, profileId, { title: title.trim() });
  }

  setPinned(id: string, profileId: string, pinned: boolean) {
    return this.conversations.update(id, profileId, {
      pinned,
      favorited: pinned ? true : false,
    });
  }

  setFavorited(id: string, profileId: string, favorited: boolean) {
    return this.conversations.update(id, profileId, { favorited });
  }

  archive(id: string, profileId: string, archived = true) {
    return this.conversations.update(id, profileId, { archived });
  }

  deleteConversation(id: string, profileId: string) {
    return this.conversations.delete(id, profileId);
  }

  listMessages(conversationId: string, profileId: string) {
    return this.messages.listForConversation(conversationId, profileId);
  }

  async touchConversation(id: string, profileId: string) {
    return this.conversations.update(id, profileId, {
      last_message_at: new Date().toISOString(),
    });
  }

  async maybeAutoTitle(
    conversation: AiConversationRow,
    profileId: string,
    firstUserMessage: string
  ) {
    if (conversation.title !== "New chat") return conversation;
    const cleaned = firstUserMessage.replace(/\s+/g, " ").trim().slice(0, 60);
    const title = cleaned.length < 8 ? "New chat" : cleaned;
    if (title === "New chat") return conversation;
    return this.conversations.update(conversation.id, profileId, { title });
  }

  createUserMessage(
    conversationId: string,
    profileId: string,
    content: string
  ): Promise<AiMessageRow> {
    return this.messages.create({
      conversation_id: conversationId,
      profile_id: profileId,
      role: "user",
      content,
      status: "complete",
    });
  }

  createAssistantPlaceholder(
    conversationId: string,
    profileId: string,
    model: string
  ): Promise<AiMessageRow> {
    return this.messages.create({
      conversation_id: conversationId,
      profile_id: profileId,
      role: "assistant",
      content: "",
      status: "streaming",
      model,
    });
  }

  finalizeAssistant(
    id: string,
    profileId: string,
    content: string,
    status: "complete" | "error" | "cancelled",
    error?: string
  ) {
    return this.messages.update(id, profileId, {
      content,
      status,
      error: error ?? null,
    });
  }

  getMessage(id: string, profileId: string) {
    return this.messages.findById(id, profileId);
  }

  updateMessage(
    id: string,
    profileId: string,
    payload: { content?: string; status?: AiMessageRow["status"] }
  ) {
    return this.messages.update(id, profileId, payload);
  }

  deleteMessagesAfter(
    conversationId: string,
    profileId: string,
    afterCreatedAt: string
  ) {
    return this.messages.deleteAfter(
      conversationId,
      profileId,
      afterCreatedAt
    );
  }

  async duplicateConversation(id: string, profileId: string) {
    const source = await this.conversations.findByIdForUser(id, profileId);
    if (!source) throw new Error("Chat not found.");
    const copy = await this.conversations.create({
      profile_id: profileId,
      title: source.title.startsWith("Copy of ")
        ? source.title
        : `Copy of ${source.title}`.slice(0, 100),
      context: source.context,
    });
    const msgs = await this.messages.listForConversation(id, profileId);
    for (const m of msgs) {
      if (m.role === "system") continue;
      await this.messages.create({
        conversation_id: copy.id,
        profile_id: profileId,
        role: m.role,
        content: m.content,
        status: m.status === "streaming" ? "complete" : m.status,
        model: m.model,
        error: m.error,
      });
    }
    return copy;
  }

  deleteMessage(id: string, profileId: string) {
    return this.messages.delete(id, profileId);
  }

  async getSettings(profileId: string) {
    return this.settings.get(profileId);
  }

  async getOrCreateSettings(profileId: string): Promise<AiMentorSettingsRow> {
    const existing = await this.settings.get(profileId);
    if (existing) return existing;
    return this.settings.upsert({ profile_id: profileId });
  }

  updateSettings(
    profileId: string,
    payload: {
      preferred_provider?: string;
      preferred_model?: string | null;
      temperature?: number;
      system_extra?: string;
    }
  ) {
    return this.settings.upsert({
      profile_id: profileId,
      ...payload,
    });
  }

  bookmarkMessage(input: {
    profileId: string;
    conversationId: string;
    messageId: string;
    snippet: string;
    label?: string;
  }) {
    return this.bookmarks.create({
      profile_id: input.profileId,
      conversation_id: input.conversationId,
      message_id: input.messageId,
      snippet: input.snippet.slice(0, 2000),
      label: input.label?.trim() || "Saved reply",
    });
  }
}
