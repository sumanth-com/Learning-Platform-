import { createClient } from "@/lib/supabase/server";
import { ensureProfile, formatDbError } from "@/lib/supabase/ensure-profile";
import {
  AI_MENTOR_ATTACHMENT_BUCKET,
  AI_MENTOR_MAX_ATTACHMENT_BYTES,
  AI_MENTOR_MAX_ATTACHMENTS,
  AttachmentsRepository,
} from "@/features/ai-mentor/repositories/attachments.repository";
import { isAllowedAttachment } from "@/features/ai-mentor/lib/attachments";
import { MentorService } from "@/features/ai-mentor/services/mentor.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "User session missing." }, { status: 401 });
  }

  try {
    await ensureProfile(supabase, user);
  } catch (error) {
    return Response.json(
      { error: formatDbError(error, "Failed to ensure profile.") },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const conversationId = String(form.get("conversationId") ?? "");
  if (!conversationId) {
    return Response.json({ error: "conversationId is required." }, { status: 400 });
  }

  const service = new MentorService(supabase);
  const conversation = await service.getConversation(conversationId, user.id);
  if (!conversation) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return Response.json({ error: "No files uploaded." }, { status: 400 });
  }
  if (files.length > AI_MENTOR_MAX_ATTACHMENTS) {
    return Response.json(
      {
        error: `You can upload at most ${AI_MENTOR_MAX_ATTACHMENTS} files at once.`,
      },
      { status: 400 }
    );
  }

  const repo = new AttachmentsRepository(supabase);
  const uploaded: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }> = [];

  for (const file of files) {
    const check = isAllowedAttachment(file.name, file.size);
    if (!check.ok) {
      return Response.json({ error: check.error }, { status: 400 });
    }
    if (file.size > AI_MENTOR_MAX_ATTACHMENT_BYTES) {
      return Response.json(
        { error: `${file.name} is too large (max 10 MB).` },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
    const path = `${user.id}/${conversationId}/${crypto.randomUUID()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(AI_MENTOR_ATTACHMENT_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (uploadError) {
      return Response.json(
        { error: uploadError.message || "Upload failed." },
        { status: 500 }
      );
    }

    const row = await repo.create({
      profile_id: user.id,
      conversation_id: conversationId,
      file_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      storage_path: path,
    });

    uploaded.push({
      id: row.id,
      fileName: row.file_name,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes,
    });
  }

  return Response.json({ attachments: uploaded });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "User session missing." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required." }, { status: 400 });
  }

  try {
    const repo = new AttachmentsRepository(supabase);
    await repo.delete(id, user.id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: formatDbError(error, "Failed to remove attachment.") },
      { status: 500 }
    );
  }
}
