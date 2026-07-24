"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function BrandIcon({
  label,
  path,
  className,
}: {
  label: string;
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-label={label}
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
} as const;

export function HubShareMenu({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(`Learning "${title}" on SupraBase`);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      {open ? (
        <div className="absolute left-0 z-40 mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              void copy();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition hover:bg-muted"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            Copy Link
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition hover:bg-muted"
          >
            <BrandIcon label="X" path={ICONS.x} className="h-3.5 w-3.5" />
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition hover:bg-muted"
          >
            <BrandIcon
              label="LinkedIn"
              path={ICONS.linkedin}
              className="h-3.5 w-3.5"
            />
            LinkedIn
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition hover:bg-muted"
          >
            <BrandIcon
              label="Facebook"
              path={ICONS.facebook}
              className="h-3.5 w-3.5"
            />
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${text}%20${encoded}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition hover:bg-muted"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${text}%0A%0A${encoded}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition hover:bg-muted"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
        </div>
      ) : null}
    </div>
  );
}
