import {
  AI_MENTOR_ATTACHMENT_BUCKET,
  AI_MENTOR_ALLOWED_EXTENSIONS,
} from "@/features/ai-mentor/repositories/attachments.repository";
import type { AiAttachmentRow } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const TEXT_EXTS = new Set([
  "txt",
  "md",
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
]);

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "webp"]);

export function extensionOf(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1)! : "";
}

export function isAllowedAttachment(fileName: string, sizeBytes: number) {
  const ext = extensionOf(fileName);
  if (
    !AI_MENTOR_ALLOWED_EXTENSIONS.includes(
      ext as (typeof AI_MENTOR_ALLOWED_EXTENSIONS)[number]
    )
  ) {
    return { ok: false as const, error: `Unsupported file type: .${ext || "unknown"}` };
  }
  if (sizeBytes > 10 * 1024 * 1024) {
    return {
      ok: false as const,
      error: "File is too large. Max size is 10 MB per file.",
    };
  }
  return { ok: true as const, ext };
}

export async function buildAttachmentPromptContext(
  client: SupabaseClient<Database>,
  attachments: AiAttachmentRow[]
): Promise<{ textBlock: string; imageParts: { mediaType: string; data: string }[] }> {
  const chunks: string[] = [];
  const imageParts: { mediaType: string; data: string }[] = [];

  for (const file of attachments) {
    const ext = extensionOf(file.file_name);
    if (!file.storage_path) {
      chunks.push(`[Attachment: ${file.file_name} — missing storage path]`);
      continue;
    }

    const { data, error } = await client.storage
      .from(AI_MENTOR_ATTACHMENT_BUCKET)
      .download(file.storage_path);
    if (error || !data) {
      chunks.push(`[Attachment: ${file.file_name} — could not read file]`);
      continue;
    }

    if (IMAGE_EXTS.has(ext)) {
      const buffer = Buffer.from(await data.arrayBuffer());
      const mediaType =
        file.mime_type && file.mime_type.startsWith("image/")
          ? file.mime_type
          : ext === "png"
            ? "image/png"
            : ext === "webp"
              ? "image/webp"
              : "image/jpeg";
      imageParts.push({
        mediaType,
        data: buffer.toString("base64"),
      });
      chunks.push(`[Image attached: ${file.file_name}]`);
      continue;
    }

    if (TEXT_EXTS.has(ext)) {
      const text = (await data.text()).slice(0, 80_000);
      chunks.push(
        `--- Attached file: ${file.file_name} ---\n${text}\n--- End of ${file.file_name} ---`
      );
      continue;
    }

    chunks.push(
      `[Binary attachment stored: ${file.file_name} (${file.mime_type}, ${file.size_bytes} bytes). Content is not inlined; use the filename/context if the user refers to it.]`
    );
  }

  return {
    textBlock: chunks.length
      ? `\n\nAttached files for this message:\n${chunks.join("\n\n")}`
      : "",
    imageParts,
  };
}
