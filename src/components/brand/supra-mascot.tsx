"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Official Supra mascot — same visual used in the AI Mentor empty state. */
export function SupraMascot({
  className,
  showLabel = false,
  labelClassName,
}: {
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none relative mx-auto h-[5.75rem] w-[5.75rem] shrink-0"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(220,163,154,0.28)_0%,transparent_68%)]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.55, 0.9, 0.55], scale: [0.96, 1.04, 0.96] }
          }
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute bottom-0 left-1/2 h-2.5 w-[48%] -translate-x-1/2 rounded-full bg-[#5f3435]/18 blur-[5px]"
          animate={
            reduceMotion
              ? undefined
              : { scaleX: [1, 0.88, 1], opacity: [0.5, 0.28, 0.5] }
          }
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute inset-[8%] rounded-[46%] border border-white/90 bg-gradient-to-br from-white via-[#f8f3ef] to-[#e8d5cf] shadow-[0_14px_28px_-14px_rgba(24,24,27,0.45),inset_0_1px_0_rgba(255,255,255,0.95)]"
          animate={reduceMotion ? undefined : { rotate: [-1.4, 1.4, -1.4] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute -top-2.5 left-1/2 h-2.5 w-[2.5px] -translate-x-1/2 rounded-full bg-[#5f3435]/75" />
          <span className="absolute -top-[15px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#a7423d] shadow-[0_0_10px_rgba(167,66,61,0.5)]" />

          <span className="absolute left-1/2 top-[20%] h-[40%] w-[68%] -translate-x-1/2 rounded-[38%] bg-[#1f2024] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <motion.span
              className="absolute left-[22%] top-1/2 h-2 w-1.5 -translate-y-1/2 rounded-full bg-[#72f3c2] shadow-[0_0_10px_rgba(114,243,194,0.8)]"
              animate={
                reduceMotion
                  ? undefined
                  : { scaleY: [1, 1, 0.12, 1, 1] }
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                times: [0, 0.48, 0.52, 0.56, 1],
              }}
            />
            <motion.span
              className="absolute right-[22%] top-1/2 h-2 w-1.5 -translate-y-1/2 rounded-full bg-[#72f3c2] shadow-[0_0_10px_rgba(114,243,194,0.8)]"
              animate={
                reduceMotion
                  ? undefined
                  : { scaleY: [1, 1, 0.12, 1, 1] }
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                times: [0, 0.48, 0.52, 0.56, 1],
              }}
            />
          </span>

          <span className="absolute bottom-[16%] left-1/2 h-[18%] w-[38%] -translate-x-1/2 rounded-full bg-white/50 blur-[0.5px]" />
        </motion.div>
      </motion.div>

      {showLabel ? (
        <p
          className={cn(
            "mt-1 text-[12px] font-medium tracking-[0.08em] text-white/45",
            labelClassName
          )}
        >
          SUPRA
        </p>
      ) : null}
    </div>
  );
}
