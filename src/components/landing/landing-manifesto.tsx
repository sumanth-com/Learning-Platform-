"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const LEAD = "The bar for developers moved.";
const BODY =
  "Knowing syntax is no longer the job. Teams hire people who can read an unfamiliar codebase, reason about trade-offs, work alongside AI and still ship something that holds up in production. Suprabase is built for that reality — you learn the concept, defend it in code, and leave with proof you can do the work.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export function LandingManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = BODY.split(" ");

  return (
    <section className="relative py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-[13px] font-medium tracking-tight text-[#f3aaa0]">
          {LEAD}
        </p>
        <p className="mt-5 text-[1.35rem] font-medium leading-[1.45] tracking-[-0.025em] text-white sm:text-[1.7rem]">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = Math.min(start + 1.6 / words.length, 1);
            return (
              <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
