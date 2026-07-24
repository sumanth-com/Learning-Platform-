import { z } from "zod";

export const learningContextSchema = z
  .object({
    moduleSlug: z.string().optional(),
    moduleTitle: z.string().optional(),
    topicTitle: z.string().optional(),
    lessonTitle: z.string().optional(),
    assignmentTitle: z.string().optional(),
    projectTitle: z.string().optional(),
    progressSummary: z.string().optional(),
  })
  .optional();

export const chatRequestSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().trim().min(1).max(32000),
  learningContext: learningContextSchema,
  mode: z.enum(["send", "regenerate", "continue", "edit"]).default("send"),
  messageId: z.string().uuid().optional(),
  attachmentIds: z.array(z.string().uuid()).max(8).optional(),
});

export const renameConversationSchema = z.object({
  conversationId: z.string().uuid(),
  title: z.string().trim().min(1).max(100),
});

export const updateMentorSettingsSchema = z.object({
  preferredProvider: z.enum(["gemini", "openai", "anthropic"]).optional(),
  preferredModel: z.string().trim().max(120).nullable().optional(),
  temperature: z.number().min(0).max(2).optional(),
  systemExtra: z.string().max(4000).optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
