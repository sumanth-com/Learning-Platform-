"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import "highlight.js/styles/github-dark.css";

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const language = /language-(\w+)/.exec(className ?? "")?.[1] ?? "code";
  const text = String(children).replace(/\n$/, "");

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="group/code relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[11px] text-white/50">
        <span className="font-medium lowercase tracking-wide">{language}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-[13px] leading-[1.65]">
        <code className={cn(className, "hljs")}>{children}</code>
      </pre>
    </div>
  );
}

export const MentorMarkdown = memo(function MentorMarkdown({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className={cn(
        "mentor-md max-w-none text-[15px] leading-[1.7] text-foreground",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        "[&_p]:my-3 [&_p]:leading-[1.7]",
        "[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight",
        "[&_h2]:mb-2.5 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold",
        "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
        "[&_li]:leading-[1.65] [&_li>p]:my-1",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const isBlock = Boolean(className?.includes("language-"));
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code
                className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.86em] text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-border bg-muted/40 px-3 py-2 font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-border/60 px-3 py-2 align-top leading-relaxed">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
