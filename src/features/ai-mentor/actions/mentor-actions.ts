"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureProfile, formatDbError } from "@/lib/supabase/ensure-profile";
import { MentorService } from "@/features/ai-mentor/services/mentor.service";
import {
  renameConversationSchema,
  updateMentorSettingsSchema,
} from "@/features/ai-mentor/schemas/mentor-schemas";
import type { AiConversationRow, AiMessageRow } from "@/types/database";
import type { LearningContext } from "@/features/ai-mentor/types";

type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  await ensureProfile(supabase, user);
  return { supabase, user };
}

function fail(error: unknown, fallback: string): ActionResult<never> {
  const message = formatDbError(error, fallback);
  console.error(`[ai-mentor] ${fallback}`, error);
  return { success: false, error: message };
}

export async function listConversationsAction(
  q?: string
): Promise<ActionResult<{ conversations: AiConversationRow[] }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    const conversations = await service.listConversations(ctx.user.id, q);
    return { success: true, data: { conversations } };
  } catch (error) {
    return fail(error, "Failed to load chats.");
  }
}

export async function createConversationAction(
  context?: LearningContext
): Promise<ActionResult<{ conversation: AiConversationRow }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.createConversation(ctx.user.id, {
      context,
    });
    if (!conversation?.id) {
      return {
        success: false,
        error: "Supabase insert failed: no conversation id returned.",
      };
    }
    return { success: true, data: { conversation } };
  } catch (error) {
    return fail(error, "Failed to create chat.");
  }
}

export async function renameConversationAction(
  input: unknown
): Promise<ActionResult<{ conversation: AiConversationRow }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  const parsed = renameConversationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid title.",
    };
  }
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.rename(
      parsed.data.conversationId,
      ctx.user.id,
      parsed.data.title
    );
    return { success: true, data: { conversation } };
  } catch (error) {
    return fail(error, "Failed to rename.");
  }
}

export async function pinConversationAction(
  conversationId: string,
  pinned: boolean
): Promise<ActionResult<{ conversation: AiConversationRow }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.setPinned(
      conversationId,
      ctx.user.id,
      pinned
    );
    return { success: true, data: { conversation } };
  } catch (error) {
    return fail(error, "Failed to pin chat.");
  }
}

export async function favoriteConversationAction(
  conversationId: string,
  favorited: boolean
): Promise<ActionResult<{ conversation: AiConversationRow }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.setFavorited(
      conversationId,
      ctx.user.id,
      favorited
    );
    return { success: true, data: { conversation } };
  } catch (error) {
    return fail(error, "Failed to favorite.");
  }
}

export async function archiveConversationAction(
  conversationId: string
): Promise<ActionResult> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    await service.archive(conversationId, ctx.user.id, true);
    return { success: true, message: "Archived." };
  } catch (error) {
    return fail(error, "Failed to archive.");
  }
}

export async function deleteConversationAction(
  conversationId: string
): Promise<ActionResult> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    await service.deleteConversation(conversationId, ctx.user.id);
    return { success: true, message: "Deleted." };
  } catch (error) {
    return fail(error, "Failed to delete.");
  }
}

export async function listMessagesAction(
  conversationId: string
): Promise<ActionResult<{ messages: AiMessageRow[] }>> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.getConversation(
      conversationId,
      ctx.user.id
    );
    if (!conversation) return { success: false, error: "Chat not found." };
    const messages = await service.listMessages(conversationId, ctx.user.id);
    return { success: true, data: { messages } };
  } catch (error) {
    return fail(error, "Failed to load messages.");
  }
}

export async function updateMentorSettingsAction(
  input: unknown
): Promise<ActionResult> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  const parsed = updateMentorSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid settings.",
    };
  }
  try {
    const service = new MentorService(ctx.supabase);
    await service.updateSettings(ctx.user.id, {
      preferred_provider: parsed.data.preferredProvider,
      preferred_model: parsed.data.preferredModel,
      temperature: parsed.data.temperature,
      system_extra: parsed.data.systemExtra,
    });
    return { success: true, message: "Settings saved." };
  } catch (error) {
    return fail(error, "Failed to save settings.");
  }
}

export async function bookmarkMessageAction(input: {
  conversationId: string;
  messageId: string;
  snippet: string;
}): Promise<ActionResult> {
  const ctx = await requireUser();
  if (!ctx.user) return { success: false, error: "User session missing. Sign in again." };
  if (!input.conversationId || !input.messageId || !input.snippet.trim()) {
    return { success: false, error: "Nothing to bookmark." };
  }
  try {
    const service = new MentorService(ctx.supabase);
    const conversation = await service.getConversation(
      input.conversationId,
      ctx.user.id
    );
    if (!conversation) return { success: false, error: "Chat not found." };
    await service.bookmarkMessage({
      profileId: ctx.user.id,
      conversationId: input.conversationId,
      messageId: input.messageId,
      snippet: input.snippet,
    });
    return { success: true, message: "Bookmarked." };
  } catch (error) {
    return fail(error, "Failed to bookmark.");
  }
}
