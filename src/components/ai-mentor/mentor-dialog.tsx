"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type MentorDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md";
};

export function MentorDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "sm",
}: MentorDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const preferred =
        root.querySelector<HTMLElement>("[data-dialog-autofocus]") ||
        root.querySelector<HTMLElement>("input,textarea") ||
        root.querySelector<HTMLElement>("button:not([aria-label='Close'])");
      preferred?.focus();
    }, 20);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
            className={cn(
              "relative z-10 w-full rounded-2xl border border-border bg-card p-5",
              "shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)]",
              size === "sm" ? "max-w-[400px]" : "max-w-[480px]"
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2
                  id={titleId}
                  className="text-[15px] font-semibold tracking-tight text-foreground"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
            {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function DialogButton({
  children,
  onClick,
  variant = "secondary",
  disabled,
  type = "button",
  autoFocus,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "secondary" | "primary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  autoFocus?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-dialog-autofocus={autoFocus ? true : undefined}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-[13px] font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "secondary" &&
          "border border-border bg-background text-foreground hover:bg-muted",
        variant === "primary" &&
          "bg-foreground text-background hover:opacity-90",
        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-600/90"
      )}
    >
      {children}
    </button>
  );
}
