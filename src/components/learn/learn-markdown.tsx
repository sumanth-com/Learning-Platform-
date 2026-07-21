"use client";

import { cn } from "@/lib/utils";

type LearnMarkdownProps = {
  content: string;
  className?: string;
};

/**
 * Lightweight markdown renderer for lesson content (headings, lists, code fences).
 */
export function LearnMarkdown({ content, className }: LearnMarkdownProps) {
  const blocks = splitBlocks(content);

  return (
    <div
      className={cn(
        "space-y-4 text-[15px] leading-7 text-zinc-300",
        className
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-[13px] leading-6 text-zinc-200"
            >
              <code className="font-mono">{block.value}</code>
            </pre>
          );
        }

        const trimmed = block.value.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={index}
              className="pt-2 text-xl font-semibold tracking-tight text-zinc-50"
            >
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={index}
              className="pt-1 text-base font-semibold text-zinc-100"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.startsWith("- ") || l.startsWith("* "));
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5 text-zinc-400">
              {items.map((item) => (
                <li key={item}>{item.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => /^\d+\.\s/.test(l));
          return (
            <ol
              key={index}
              className="list-decimal space-y-1.5 pl-5 text-zinc-400"
            >
              {items.map((item) => (
                <li key={item}>{item.replace(/^\d+\.\s+/, "")}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="text-zinc-400">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function splitBlocks(content: string): Array<{ type: "text" | "code"; value: string }> {
  const parts = content.split(/```/);
  const blocks: Array<{ type: "text" | "code"; value: string }> = [];

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      const lines = part.split("\n");
      const maybeLang = lines[0]?.trim() ?? "";
      const body =
        lines.length > 1 && /^[a-zA-Z0-9_+-]*$/.test(maybeLang)
          ? lines.slice(1).join("\n")
          : part;
      blocks.push({ type: "code", value: body.replace(/\n$/, "") });
      return;
    }

    const paragraphs = part.split(/\n\n+/);
    for (const p of paragraphs) {
      if (p.trim()) blocks.push({ type: "text", value: p });
    }
  });

  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const pieces = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return pieces.map((piece, i) => {
    if (piece.startsWith("`") && piece.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[13px] text-indigo-200"
        >
          {piece.slice(1, -1)}
        </code>
      );
    }
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-200">
          {piece.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{piece}</span>;
  });
}
