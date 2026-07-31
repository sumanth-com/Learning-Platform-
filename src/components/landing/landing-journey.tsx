"use client";

import { motion } from "framer-motion";
import {
  Award,
  FolderGit2,
  GitBranch,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

const USEFUL = [
  {
    icon: Sparkles,
    line: "AI Mentor — context-aware help the moment you stall",
  },
  {
    icon: Terminal,
    line: "Browser Practice — write, run, and debug without setup",
  },
  {
    icon: FolderGit2,
    line: "Portfolio Projects — ship work you can defend in interviews",
  },
  {
    icon: Award,
    line: "Verifiable Certs — credentials employers can check online",
  },
  {
    icon: GitBranch,
    line: "Connected Roadmap — one path from fundamentals to production",
  },
] as const;

export function LandingJourney() {
  return (
    <section
      id="journey"
      className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal className="mx-auto max-w-4xl text-center">
        <span className={styles.sectionPill}>Most useful</span>
        <h2 className={`${styles.sectionHeading} sm:whitespace-nowrap`}>
          What actually helps you move forward
        </h2>
      </Reveal>

      <ul className="mx-auto mt-12 max-w-3xl space-y-3">
        {USEFUL.map((item, index) => (
          <motion.li
            key={item.line}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`${styles.usefulRow} group flex items-center gap-3.5 overflow-hidden`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e56b68]/12 text-[#f3aaa0]">
              <item.icon className="h-4 w-4" />
            </span>
            <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium tracking-tight text-white/85 transition group-hover:text-white sm:text-[14.5px]">
              {item.line}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
