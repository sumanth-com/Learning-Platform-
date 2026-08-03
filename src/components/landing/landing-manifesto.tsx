"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Award, FolderGit2, LayoutGrid, Sparkles } from "lucide-react";
import { CountUp, Reveal, RevealGroup, RevealItem } from "./reveal";
import type { LandingStat } from "./landing-stats";
import styles from "./landing.module.css";

const LEAD = "Modern software engineering is more than writing code.";
const BODY =
  "The best engineers don't just know syntax—they understand architecture, debugging, scalability, AI-assisted development, databases, system design, deployment, and product thinking. Suprabase brings everything into one platform so you build software that resembles real production applications.";

const ICONS = [LayoutGrid, FolderGit2, Sparkles, Award] as const;

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

export function LandingManifesto({ stats }: { stats: LandingStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = BODY.split(" ");

  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e56b68]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
          <div ref={ref} className="max-w-xl">
            <h2 className="text-[13px] font-medium tracking-tight text-[#f3aaa0]">
              {LEAD}
            </h2>
            <p className="mt-5 text-[1.25rem] font-medium leading-[1.45] tracking-[-0.025em] text-white sm:text-[1.55rem]">
              {words.map((word, index) => {
                const start = index / words.length;
                const end = Math.min(start + 1.6 / words.length, 1);
                return (
                  <Word
                    key={`${word}-${index}`}
                    progress={scrollYProgress}
                    range={[start, end]}
                  >
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>

          <Reveal from="right">
            <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, index) => {
                const Icon = ICONS[index % ICONS.length];
                return (
                  <RevealItem
                    key={stat.label}
                    className={`${styles.statCard} group relative overflow-hidden`}
                  >
                    <div
                      aria-hidden
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e56b68]/12 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="relative flex items-start justify-between gap-2">
                      <p className="text-[1.85rem] font-medium leading-none tracking-[-0.05em] text-white sm:text-[2.1rem]">
                        {stat.display ? (
                          <span className="block text-[1.25rem] leading-[1.15] tracking-[-0.03em] sm:text-[1.4rem]">
                            {stat.display}
                          </span>
                        ) : (
                          <CountUp to={stat.value ?? 0} suffix={stat.suffix} />
                        )}
                      </p>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e56b68]/12 text-[#f3aaa0] shadow-inner shadow-white/[0.03] sm:h-9 sm:w-9 sm:rounded-xl">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                    <p className="relative mt-5 text-[12px] font-medium text-white/85 sm:mt-6 sm:text-[12.5px]">
                      {stat.label}
                    </p>
                    <p className="relative mt-1 text-[11px] leading-4 text-white/38 sm:text-[11.5px] sm:leading-5">
                      {stat.detail}
                    </p>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
