import { Award, Check, GitBranch, Terminal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import styles from "./landing.module.css";

const WEEK_BARS = [38, 52, 44, 66, 58, 78, 92];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug"];

function CircuitTrace({
  side,
  slot,
}: {
  side: "left" | "right";
  slot: "top" | "bottom";
}) {
  const isLeft = side === "left";
  const isTop = slot === "top";

  /* Motherboard-style elbows: out from the card, jog vertically, then into the orb. */
  const d = isLeft
    ? isTop
      ? "M 0 28 H 34 V 8 H 78"
      : "M 0 28 H 34 V 48 H 78"
    : isTop
      ? "M 78 28 H 44 V 8 H 0"
      : "M 78 28 H 44 V 48 H 0";

  return (
    <svg
      aria-hidden
      viewBox="0 0 78 56"
      className={cn(
        "pointer-events-none absolute top-1/2 hidden h-14 w-[4.85rem] -translate-y-1/2 md:block",
        isLeft ? "left-full" : "right-full",
        styles.circuitTrace
      )}
      style={{
        ["--delay" as string]:
          slot === "top" ? (isLeft ? "0s" : "-0.8s") : isLeft ? "-1.6s" : "-2.4s",
      }}
    >
      <path d={d} className={styles.circuitTracePath} />
      <path d={d} className={styles.circuitTracePulse} pathLength={1} />
      <circle
        cx={isLeft ? 0 : 78}
        cy={28}
        r={2.2}
        className={styles.circuitVia}
      />
      <circle
        cx={isLeft ? 78 : 0}
        cy={isTop ? 8 : 48}
        r={2.2}
        className={styles.circuitVia}
      />
      <circle
        cx={isLeft ? 34 : 44}
        cy={isTop ? 8 : 48}
        r={1.5}
        className={styles.circuitNode}
      />
    </svg>
  );
}

function CoreCard({
  icon: Icon,
  title,
  side,
  slot,
  children,
}: {
  icon: typeof GitBranch;
  title: string;
  side: "left" | "right";
  slot: "top" | "bottom";
  children: React.ReactNode;
}) {
  return (
    <RevealItem className="relative h-full">
      <div className={`${styles.premiumCard} flex h-full flex-col`}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e56b68]/12 text-[#f3aaa0]">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <p className="text-[12.5px] font-medium text-white/90">{title}</p>
        </div>
        <div className="mt-3.5 flex flex-1 flex-col justify-center">{children}</div>
      </div>

      <CircuitTrace side={side} slot={slot} />
    </RevealItem>
  );
}

function Row({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-black/20 px-2.5 py-2">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border",
          done
            ? "border-[#e56b68]/40 bg-[#e56b68]/20 text-[#f3b7ac]"
            : "border-white/10 bg-white/[0.02] text-transparent"
        )}
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "truncate text-[11.5px]",
          done ? "text-white/45 line-through decoration-white/20" : "text-white/70"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function LandingCore() {
  return (
    <section id="platform" className="relative overflow-x-clip py-16 sm:overflow-hidden sm:py-28">
      <div aria-hidden className={styles.coreGrid} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className={styles.sectionPill}>One connected system</span>
          <h2 className={`${styles.sectionHeading} mx-auto max-w-[20rem] max-md:text-[1.7rem] max-md:leading-[1.2] sm:max-w-3xl`}>
            <span className="sm:hidden">
              <span className="block">One profile. Every skill.</span>
              <span className="block">Every project. Every certification.</span>
            </span>
            <span className="hidden sm:inline">
              One profile. Every skill. Every project. Every certification.
            </span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-2xl text-balance text-[13px] leading-6 text-white/45 max-md:mt-3 max-md:max-w-[21rem] max-md:text-[12.5px] max-md:leading-[1.45]">
            <span className="sm:hidden">
              Your roadmap, practice, AI mentor, projects, and certifications
              stay connected—from beginner to production-ready developer.
            </span>
            <span className="hidden sm:inline">
              Your roadmap, coding practice, AI mentor, projects, certifications,
              notes, and progress stay connected—creating a personalized software
              engineering experience from beginner to production-ready developer.
            </span>
          </p>
        </Reveal>

        <RevealGroup
          delay={0.1}
          className="relative mt-12 grid items-stretch gap-4 sm:mt-16 sm:gap-5 md:grid-cols-[minmax(0,1fr)_10.5rem_minmax(0,1fr)] md:grid-rows-2 md:gap-x-12 md:gap-y-6 lg:grid-cols-[minmax(0,1fr)_13rem_minmax(0,1fr)] lg:gap-x-16"
        >
          <div className="h-full md:col-start-1 md:row-start-1">
            <CoreCard icon={GitBranch} title="Roadmap" side="left" slot="top">
              <div className="space-y-2">
                <Row label="Week 4 · Async JavaScript" done />
                <Row label="Week 5 · React state model" />
              </div>
            </CoreCard>
          </div>

          <div className="h-full md:col-start-1 md:row-start-2">
            <CoreCard icon={Terminal} title="Practice" side="left" slot="bottom">
              <div className="rounded-lg bg-black/35 px-2.5 py-3 font-mono text-[10.5px] leading-5 shadow-inner shadow-black/20">
                <p className="text-white/35">$ run debounce.test.ts</p>
                <p className="mt-1 text-[#8fd3a8]">✓ 12 passing · 0 failing</p>
              </div>
            </CoreCard>
          </div>

          {/* Plain div — Framer transform parents can freeze CSS ring animations on iOS */}
          <div className="relative z-10 mx-auto flex h-[13.5rem] w-full max-w-[16rem] items-center justify-center self-center overflow-visible py-2 md:col-start-2 md:row-span-2 md:h-[12rem] md:w-[12rem] md:max-w-none md:py-0 lg:h-[14.5rem] lg:w-[14.5rem]">
            <span aria-hidden className={styles.coreHalo} />
            <span aria-hidden className={styles.coreOrb}>
              <span className={`${styles.coreRing} ${styles.coreRingA}`} />
              <span className={`${styles.coreRing} ${styles.coreRingB}`} />
              <span className={`${styles.coreRing} ${styles.coreRingC}`} />
            </span>
            <span className="pointer-events-none absolute bottom-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 md:bottom-1">
              Ask Supra
            </span>
          </div>

          <div className="h-full md:col-start-3 md:row-start-1">
            <CoreCard icon={TrendingUp} title="Progress" side="right" slot="top">
              <div>
                <div className="flex h-[4.5rem] items-end gap-1.5">
                  {WEEK_BARS.map((height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%` }}
                      className="flex-1 rounded-t-[3px] bg-gradient-to-t from-[#e56b68]/25 to-[#f4a06f]/80"
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[9.5px] text-white/30">
                  {MONTHS.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </CoreCard>
          </div>

          <div className="h-full md:col-start-3 md:row-start-2">
            <CoreCard
              icon={Award}
              title="Certifications"
              side="right"
              slot="bottom"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-2">
                  <span className="text-[11.5px] text-white/70">
                    TypeScript · Intermediate
                  </span>
                  <span className="rounded-full bg-[#e56b68]/15 px-2 py-0.5 text-[9.5px] font-medium text-[#f3b7ac]">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-2">
                  <span className="text-[11.5px] text-white/70">
                    System Design · Basic
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9.5px] font-medium text-white/45">
                    In progress
                  </span>
                </div>
              </div>
            </CoreCard>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
