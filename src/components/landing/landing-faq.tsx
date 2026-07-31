import { Plus } from "lucide-react";
import { Reveal } from "./reveal";
import styles from "./landing.module.css";

export const FAQ_ITEMS = [
  {
    question: "What is Suprabase?",
    answer:
      "Suprabase is a software engineering platform for Full Stack Development, AI Engineering, System Design, and modern DevOps. It combines structured learning paths, hands-on coding, real-world projects, an AI mentor that understands your progress, and verifiable certifications employers can trust.",
  },
  {
    question: "How does Suprabase help you become a software engineer?",
    answer:
      "You follow production-focused paths, practice by building, ship portfolio projects, get contextual AI mentoring, and earn certifications that prove skill—not just completion. Everything stays connected on one profile so progress compounds.",
  },
  {
    question: "Can beginners learn Full Stack Development?",
    answer:
      "Yes. Paths start with fundamentals and build toward React, Next.js, Node.js, databases, and deployment. If you already write code, you can move through familiar modules quickly and focus on what is new.",
  },
  {
    question: "Does Suprabase teach AI Engineering?",
    answer:
      "Yes. AI Engineering covers modern AI tooling, RAG, LangChain-style workflows, and production patterns alongside Full Stack Development—so you ship applications that use AI responsibly, not just demos.",
  },
  {
    question: "Are the certificates verifiable?",
    answer:
      "Yes. A certificate is issued only after you clear a timed skill test. Each credential has a unique ID and a public verification page—anyone can confirm it by link or QR code, no account required.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="text-center">
        <span className={styles.sectionPill}>Questions</span>
        <h2 className={styles.sectionHeading}>
          Software engineering questions, answered
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-12 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.055] to-white/[0.015] shadow-[0_18px_50px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="flex-1 text-[14px] font-medium text-white/85 transition group-hover:text-white">
                {item.question}
              </h3>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/45 shadow-inner shadow-white/[0.03] transition duration-300 group-open:rotate-45 group-open:bg-[#e56b68]/15 group-open:text-[#f3aaa0]">
                <Plus className="h-3.5 w-3.5" />
              </span>
            </summary>
            <p className="px-5 pb-5 pr-14 text-[13px] leading-6 text-white/48">
              {item.answer}
            </p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
