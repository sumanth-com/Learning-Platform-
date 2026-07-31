"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { JOURNEY_STEPS } from "./content";
import { useInViewOnce, usePrefersReducedMotion } from "./demo-hooks";

export function StudentJourney() {
  const { ref, inView } = useInViewOnce(0.2);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="journey"
      ref={ref}
      className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3aaa0]">
          Student journey
        </p>
        <h2 className="mt-3 text-balance text-[2rem] font-medium tracking-[-0.04em] text-white sm:text-[2.6rem]">
          From first login to job-ready
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-white/55">
          A clear path that compounds — learn, practice, ship, prove, and show
          your work.
        </p>
      </div>

      <ol className="relative mx-auto mt-14 max-w-3xl space-y-4">
        <div
          aria-hidden
          className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-[#e56b68]/50 via-white/15 to-transparent sm:left-[1.35rem]"
        />
        {JOURNEY_STEPS.map((step, index) => (
          <motion.li
            key={step.title}
            initial={reduced ? false : { opacity: 0, x: -16 }}
            animate={
              inView || reduced
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -16 }
            }
            transition={{ delay: reduced ? 0 : index * 0.08, duration: 0.45 }}
            className="relative flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:gap-5 sm:p-5"
          >
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e56b68]/35 bg-[#1a1416] text-[12px] font-semibold text-[#f3aaa0] sm:h-10 sm:w-10">
              {index + 1}
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-[15px] font-medium text-white">{step.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/50">
                {step.detail}
              </p>
            </div>
            {index < JOURNEY_STEPS.length - 1 ? (
              <ArrowRight className="ml-auto hidden h-4 w-4 shrink-0 text-white/20 sm:block" />
            ) : null}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
