"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODEL_OPTIONS = [
  { id: "supra", label: "Supra", available: true },
  { id: "supra-pro", label: "Supra Pro", available: false },
  { id: "supra-pro-plus", label: "Supra Pro+", available: false },
  { id: "premium", label: "Premium", available: false },
] as const;

type MentorModelPickerProps = {
  /** Compact pill (desktop) vs ChatGPT-style title next to hamburger. */
  variant?: "pill" | "title";
  className?: string;
};

/**
 * Model switcher. Dropdown portals to document.body so it never clips
 * or stacks under chat bubbles.
 */
export function MentorModelPicker({
  variant = "pill",
  className,
}: MentorModelPickerProps) {
  const [open, setOpen] = useState(false);
  const [modelId, setModelId] = useState<(typeof MODEL_OPTIONS)[number]["id"]>(
    "supra"
  );
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const current =
    MODEL_OPTIONS.find((m) => m.id === modelId) ?? MODEL_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const place = () => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = 196;
      const left = Math.min(
        Math.max(8, r.left),
        window.innerWidth - width - 8
      );
      setMenuPos({ top: r.bottom + 6, left });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          variant === "pill"
            ? cn(
                "h-8 gap-1.5 rounded-full border border-border/70 bg-muted/50 px-2.5",
                "text-[12px] font-medium text-foreground/90",
                "hover:border-border hover:bg-muted",
                open && "border-border bg-muted"
              )
            : cn(
                "h-9 gap-0.5 rounded-lg px-1.5",
                "text-[15px] font-semibold tracking-tight text-foreground",
                "hover:bg-muted/70",
                open && "bg-muted/70"
              )
        )}
      >
        <span
          className={cn(
            "truncate",
            variant === "title" ? "max-w-[7.5rem]" : "max-w-[140px]"
          )}
        >
          {current.label}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-150",
            variant === "title" ? "h-4 w-4" : "h-3.5 w-3.5",
            open && "rotate-180"
          )}
        />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && menuPos ? (
                <motion.div
                  ref={menuRef}
                  role="listbox"
                  aria-label="Model"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -2, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  className="fixed z-[80] w-[196px] overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={opt.id === modelId}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                        opt.id === modelId
                          ? "bg-muted font-medium text-foreground"
                          : "text-foreground hover:bg-muted/70",
                        !opt.available && "opacity-70"
                      )}
                      onClick={() => {
                        if (!opt.available) {
                          toast.message(`${opt.label} is coming soon`);
                          return;
                        }
                        setModelId(opt.id);
                        setOpen(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {!opt.available ? (
                        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Soon
                        </span>
                      ) : opt.id === modelId ? (
                        <span className="text-[11px] text-muted-foreground">
                          Active
                        </span>
                      ) : null}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
