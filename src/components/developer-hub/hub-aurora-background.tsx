"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Soft moving aurora behind Developer Hub. */
export function HubAuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <motion.div
        className="absolute -left-[18%] -top-[8%] h-[48%] w-[62%] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-terracotta, #5b6cff) 42%, transparent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 36, -18, 0],
          y: [0, 24, -12, 0],
          scale: [1, 1.1, 0.96, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[12%] top-[2%] h-[42%] w-[55%] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-slate, #38bdf8) 40%, transparent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -28, 20, 0],
          y: [0, 32, -14, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] left-[18%] h-[40%] w-[58%] rounded-full opacity-28 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-sage, #34d399) 38%, transparent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 24, -30, 0],
          y: [0, -20, 16, 0],
          scale: [1, 1.06, 0.94, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] right-[8%] h-[30%] w-[36%] rounded-full opacity-22 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--palette-sand, #fbbf24) 45%, transparent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -16, 12, 0],
          y: [0, 18, -14, 0],
          opacity: [0.16, 0.28, 0.18, 0.16],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mentor-aurora-mesh absolute inset-0 opacity-[0.18] mix-blend-soft-light dark:opacity-[0.14]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/70" />
    </div>
  );
}
