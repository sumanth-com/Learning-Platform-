"use client";

import { motion } from "framer-motion";
import { Award, Compass, FolderGit2, GraduationCap, Terminal } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: Compass,
    title: "Pick your path",
    body: "Full Stack or AI. Each path is split into phases so the scope never feels infinite.",
  },
  {
    icon: GraduationCap,
    title: "Learn the concept",
    body: "Short, dense lessons with the why behind each API — not a transcript of the docs.",
  },
  {
    icon: Terminal,
    title: "Practice immediately",
    body: "Challenges run in the browser. The mentor is one keystroke away when you stall.",
  },
  {
    icon: FolderGit2,
    title: "Ship a real project",
    body: "Assemble what you learned into an application you would actually put on a resume.",
  },
  {
    icon: Award,
    title: "Prove the skill",
    body: "Pass the certification test and share a credential anyone can verify online.",
  },
];

export function LandingJourney() {
  return (
    <section
      id="journey"
      className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3aaa0]">
          How it works
        </p>
        <h2 className="mt-4 text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:whitespace-nowrap sm:text-[2.6rem]">
          One continuous loop, start to credential
        </h2>
      </Reveal>

      <div className="mt-14">
        <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -70px 0px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative min-h-[15rem] overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.065] to-white/[0.018] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e56b68]/12 text-[#f3aaa0] shadow-inner shadow-white/[0.04]"
              >
                <step.icon className="h-[1.15rem] w-[1.15rem]" />
              </span>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/28">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-[17px] font-medium tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-5 text-white/45">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
