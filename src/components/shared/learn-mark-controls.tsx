"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const learnNavBtn =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-medium transition-colors ring-1 sm:text-sm";

export const learnMarkBtn = "min-w-[7.75rem] px-3.5 sm:min-w-[8.5rem] sm:px-4";

interface MarkCompleteButtonProps {
  done: boolean;
  disabled?: boolean;
  labelPending: string;
  labelDone: string;
  onClick: () => void;
  pulse?: boolean;
  className?: string;
}

export function MarkCompleteButton({
  done,
  disabled,
  labelPending,
  labelDone,
  onClick,
  pulse,
  className,
}: MarkCompleteButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      animate={pulse ? { scale: [1, 1.07, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        learnNavBtn,
        learnMarkBtn,
        done
          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
          : "bg-indigo-500/10 text-indigo-300 ring-indigo-500/30 hover:bg-indigo-500/15",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="done"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3.5 w-3.5 shrink-0" />
            {labelDone}
          </motion.span>
        ) : (
          <motion.span
            key="pending"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Circle className="h-3.5 w-3.5 shrink-0" />
            {labelPending}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface SidebarItemIndicatorProps {
  displayNum: number;
  done: boolean;
  active: boolean;
}

export function SidebarItemIndicator({ displayNum, done, active }: SidebarItemIndicatorProps) {
  return (
    <span
      className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold tabular-nums",
        active
          ? "bg-indigo-500/20 text-indigo-300"
          : done
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-zinc-800 text-zinc-500"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
          >
            <Check className="h-3 w-3" />
          </motion.span>
        ) : (
          <motion.span
            key="num"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
          >
            {displayNum}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
