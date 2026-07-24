"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  FileArchive,
  FileCode2,
  FileText,
  Loader2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { AiAttachmentRow } from "@/types/database";

export type DisplayAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url?: string | null;
  isImage: boolean;
};

export type ComposerFileChip = {
  localId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl?: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

/** Strip backend-injected attachment markup from visible message text. */
export function stripAttachmentMarkup(content: string): string {
  let text = content;
  text = text.replace(/\n\nAttached files for this message:\n[\s\S]*$/i, "");
  text = text.replace(/\[Image attached:[^\]]*\]/gi, "");
  text = text.replace(
    /--- Attached file:[\s\S]*?--- End of[^\n]*---/gi,
    ""
  );
  text = text.replace(
    /\[Binary attachment stored:[^\]]*\]/gi,
    ""
  );
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

/** Keep backend attachment context when the user edits visible text. */
export function withPreservedAttachmentMarkup(
  original: string,
  nextVisible: string
): string {
  const match = original.match(/\n\nAttached files for this message:\n[\s\S]*$/i);
  const suffix = match?.[0] ?? "";
  const trimmed = nextVisible.replace(/\s+$/g, "").trim();
  if (!suffix) return trimmed;
  return trimmed ? `${trimmed}${suffix}` : suffix.trimStart();
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mimeType: string, fileName: string): ReactNode {
  const lower = `${mimeType} ${fileName}`.toLowerCase();
  if (lower.includes("zip") || lower.includes("archive")) {
    return <FileArchive className="h-4 w-4" />;
  }
  if (
    /\.(js|ts|tsx|jsx|py|java|cpp|c|h|json|md)(\W|$)/.test(lower) ||
    lower.includes("javascript") ||
    lower.includes("typescript")
  ) {
    return <FileCode2 className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
}

export function ComposerAttachmentChip({
  file,
  onRemove,
  onRetry,
}: {
  file: ComposerFileChip;
  onRemove: () => void;
  onRetry?: () => void;
}) {
  const isImage = file.mimeType.startsWith("image/") && Boolean(file.previewUrl);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-background/80 shadow-sm",
        file.status === "error" ? "border-rose-500/40" : "border-border/80",
        isImage ? "h-14 w-14" : "max-w-[200px]"
      )}
    >
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.previewUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex items-center gap-2 px-2.5 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {fileIcon(file.mimeType, file.fileName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-foreground">
              {file.fileName}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {file.status === "error"
                ? file.error || "Failed"
                : file.status === "done"
                  ? formatBytes(file.sizeBytes)
                  : `Uploading ${file.progress}%`}
            </p>
          </div>
        </div>
      )}

      {(file.status === "uploading" || file.status === "queued") && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10">
          <div
            className="h-full bg-foreground/80 transition-all duration-200"
            style={{ width: `${Math.max(file.progress, 8)}%` }}
          />
        </div>
      )}

      {file.status === "uploading" && isImage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </div>
      ) : null}

      {file.status === "done" && isImage ? (
        <div className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-emerald-500 p-0.5 text-white shadow">
          <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
            <path
              d="M3.5 8.5l3 3 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}

      <div className="absolute right-1 top-1 flex gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        {file.status === "error" && onRetry ? (
          <button
            type="button"
            aria-label="Retry upload"
            onClick={onRetry}
            className="rounded-full bg-background/95 p-1 shadow ring-1 ring-border"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Remove attachment"
          onClick={onRemove}
          className="rounded-full bg-background/95 p-1 shadow ring-1 ring-border"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

export function MessageAttachments({
  attachments,
  onOpenImage,
}: {
  attachments: DisplayAttachment[];
  onOpenImage: (index: number) => void;
}) {
  if (attachments.length === 0) return null;
  const images = attachments.filter((a) => a.isImage && a.url);
  const files = attachments.filter((a) => !a.isImage || !a.url);

  return (
    <div className="mb-2 flex flex-col items-end gap-2">
      {images.length > 0 ? (
        <div className="flex flex-wrap justify-end gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onOpenImage(i)}
              className="group overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url!}
                alt={img.fileName}
                loading="lazy"
                className="max-h-[220px] max-w-[220px] object-cover opacity-0 transition-opacity duration-300 data-[ready=true]:opacity-100"
                onLoad={(e) => {
                  e.currentTarget.dataset.ready = "true";
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="flex flex-wrap justify-end gap-2">
          {files.map((file) => (
            <a
              key={file.id}
              href={file.url || undefined}
              download={file.fileName}
              target={file.url ? "_blank" : undefined}
              rel="noreferrer"
              className={cn(
                "flex max-w-[240px] items-center gap-2.5 rounded-2xl border border-border/80 bg-background px-3 py-2.5 shadow-sm",
                "transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md",
                !file.url && "pointer-events-none opacity-70"
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                {fileIcon(file.mimeType, file.fileName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {file.fileName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatBytes(file.sizeBytes)}
                </p>
              </div>
              <Download className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ImagePreviewModal({
  open,
  attachments,
  index,
  onClose,
  onIndexChange,
}: {
  open: boolean;
  attachments: DisplayAttachment[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const images = useMemo(
    () => attachments.filter((a) => a.isImage && a.url),
    [attachments]
  );
  const safeIndex = Math.min(Math.max(index, 0), Math.max(images.length - 1, 0));
  const current = images[safeIndex];
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
  }, [open, safeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && images.length > 1) {
        onIndexChange((safeIndex + 1) % images.length);
      }
      if (e.key === "ArrowLeft" && images.length > 1) {
        onIndexChange((safeIndex - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onIndexChange, safeIndex, images.length]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.fileName}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col"
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-white">
              <p className="truncate text-sm font-medium">{current.fileName}</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="rounded-lg p-2 hover:bg-white/10"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Fit to screen"
                  className="rounded-lg px-2 py-1 text-xs hover:bg-white/10"
                  onClick={() => setZoom(1)}
                >
                  Fit
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="rounded-lg p-2 hover:bg-white/10"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  className="rounded-lg p-2 hover:bg-white/10"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url!}
                alt={current.fileName}
                style={{ transform: `scale(${zoom})` }}
                className="max-h-[78vh] max-w-full object-contain transition-transform duration-150"
              />
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    onClick={() =>
                      onIndexChange(
                        (safeIndex - 1 + images.length) % images.length
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    onClick={() =>
                      onIndexChange((safeIndex + 1) % images.length)
                    }
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function useConversationAttachments(conversationId: string | null) {
  const [byMessageId, setByMessageId] = useState<
    Record<string, DisplayAttachment[]>
  >({});

  const reload = useCallback(async () => {
    if (!conversationId) {
      setByMessageId({});
      return;
    }
    const { createClient } = await import("@/lib/supabase/client");
    const { AI_MENTOR_ATTACHMENT_BUCKET } = await import(
      "@/features/ai-mentor/repositories/attachments.repository"
    );
    const supabase = createClient();
    const { data, error } = await supabase
      .from("ai_attachments")
      .select(
        "id, message_id, file_name, mime_type, size_bytes, storage_path"
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error || !data) return;

    const rows = data as Pick<
      AiAttachmentRow,
      | "id"
      | "message_id"
      | "file_name"
      | "mime_type"
      | "size_bytes"
      | "storage_path"
    >[];

    const mapped: Record<string, DisplayAttachment[]> = {};
    for (const row of rows) {
      if (!row.message_id) continue;
      const isImage = Boolean(
        row.mime_type?.startsWith("image/") ||
          /\.(png|jpe?g|webp)$/i.test(row.file_name)
      );
      let url: string | null = null;
      if (row.storage_path) {
        const { data: signed } = await supabase.storage
          .from(AI_MENTOR_ATTACHMENT_BUCKET)
          .createSignedUrl(row.storage_path, 60 * 60);
        url = signed?.signedUrl ?? null;
      }
      const item: DisplayAttachment = {
        id: row.id,
        fileName: row.file_name,
        mimeType: row.mime_type,
        sizeBytes: row.size_bytes,
        url,
        isImage,
      };
      (mapped[row.message_id] ??= []).push(item);
    }
    setByMessageId(mapped);
  }, [conversationId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { attachmentsByMessageId: byMessageId, reloadAttachments: reload };
}
