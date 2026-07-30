import { Plus } from "lucide-react";
import { Reveal } from "./reveal";

export const FAQ_ITEMS = [
  {
    question: "What is Suprabase?",
    answer:
      "Suprabase is a learning platform for Full Stack and AI developers. It combines a sequenced 12-week curriculum, in-browser coding challenges, portfolio projects, an AI mentor that understands your current module, and skill certifications with public verification links.",
  },
  {
    question: "Who is Suprabase for?",
    answer:
      "Students and self-taught developers who want a single structured path instead of scattered tutorials. It suits beginners starting from web fundamentals and working developers who want to add AI engineering, system design or backend depth.",
  },
  {
    question: "How long does the curriculum take?",
    answer:
      "The core path is 12 weeks of curriculum organised into phases. It is self-paced, so the calendar time depends on you — most learners treat one week of material as one week of part-time study.",
  },
  {
    question: "Do I need programming experience to start?",
    answer:
      "No. The first phase covers web fundamentals from the beginning. If you already write code, the roadmap lets you move through familiar modules quickly and spend your time on the phases that are new to you.",
  },
  {
    question: "How is the AI mentor different from a general chatbot?",
    answer:
      "A general chatbot starts from zero every session. The Suprabase mentor receives the module you are studying, the code in your editor and the topics you have already completed, then answers in explain, debug, review or build mode at that exact level.",
  },
  {
    question: "Are the certificates verifiable by employers?",
    answer:
      "Yes. A certificate is only issued after you clear the passing score on a timed skill test. Each one is stored server-side with a unique credential ID and a public verification page, so anyone can confirm it by opening the link or scanning the QR code — no account needed.",
  },
  {
    question: "Which technologies does Suprabase cover?",
    answer:
      "JavaScript, TypeScript, React, Next.js, Node.js, Python, SQL, PostgreSQL, MongoDB, Docker, Git, DevOps, data structures, algorithms, system design and AI engineering, each with its own certification track.",
  },
  {
    question: "Does it cost anything to get started?",
    answer:
      "Creating an account is free. You can sign up, pick a track and open the first module in under a minute.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="relative mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3aaa0]">
          Questions
        </p>
        <h2 className="mt-4 text-balance text-[1.95rem] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:text-[2.3rem]">
          Everything students ask before starting
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-12 grid items-start gap-3 md:grid-cols-2">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.018] shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="flex-1 text-[14px] font-medium text-white/85 transition group-hover:text-white">
                {item.question}
              </h3>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.055] text-white/45 shadow-inner shadow-white/[0.03] transition duration-300 group-open:rotate-45 group-open:bg-[#e56b68]/15 group-open:text-[#f3aaa0]">
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
