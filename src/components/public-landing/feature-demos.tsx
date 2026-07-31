"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  Share2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PATH_STAGES, type TourTabId } from "./content";
import { stageFromProgress } from "./demo-hooks";

function Shell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-full min-h-[300px] p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DemoFrame({
  kind,
  progress,
}: {
  kind: TourTabId;
  progress: number;
}) {
  switch (kind) {
    case "dashboard":
      return <DashboardDemo progress={progress} />;
    case "roadmap":
      return <RoadmapDemo progress={progress} />;
    case "mentor":
      return <MentorDemo progress={progress} />;
    case "projects":
      return <ProjectsDemo progress={progress} />;
    case "hub":
      return <HubDemo progress={progress} />;
    case "certs":
      return <CertsDemo progress={progress} />;
    case "profile":
      return <ProfileDemo progress={progress} />;
  }
}

function DashboardDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 4);
  const completion = Math.round(28 + progress * 56);
  return (
    <Shell className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
      <Panel>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          Good afternoon, Alex
        </p>
        <p className="mt-2 text-[18px] font-medium tracking-tight text-white">
          Keep momentum on Full Stack Path
        </p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#db5b65] to-[#f1a379]"
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Phase progress", "Streak", "XP"].map((label, i) => (
            <div
              key={label}
              className={cn(
                "rounded-xl border border-white/8 bg-black/20 p-3 transition",
                stage >= i && "border-[#e56b68]/35 bg-[#e56b68]/8"
              )}
            >
              <p className="text-[9px] text-white/40">{label}</p>
              <p className="mt-1 text-[15px] font-semibold text-white">
                {i === 0 ? `${completion}%` : i === 1 ? "12d" : "1,840"}
              </p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          Up next
        </p>
        <div className="mt-3 space-y-2">
          {["Auth architecture", "API project lab", "Mentor review"].map(
            (item, i) => (
              <div
                key={item}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-white/8 px-3 py-2.5 text-[12px] text-white/55",
                  stage >= i && "border-white/15 text-white"
                )}
              >
                <span>{item}</span>
                {stage > i ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#78d7a6]" />
                ) : null}
              </div>
            )
          )}
        </div>
      </Panel>
    </Shell>
  );
}

function RoadmapDemo({ progress }: { progress: number }) {
  const unlocked = Math.min(
    PATH_STAGES.length,
    1 + Math.floor(progress * PATH_STAGES.length)
  );
  const xp = Math.round(80 + progress * 440);
  return (
    <Shell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
            Learning path
          </p>
          <p className="mt-1 text-[16px] font-medium text-white">
            Full Stack developer
          </p>
        </div>
        <div className="rounded-full border border-[#e56b68]/30 bg-[#e56b68]/12 px-3 py-1 text-[11px] font-semibold text-[#f3aaa0]">
          {xp} XP
        </div>
      </div>
      <div className="space-y-2.5">
        {PATH_STAGES.map((stage, index) => {
          const open = index < unlocked;
          return (
            <motion.div
              key={stage.title}
              initial={false}
              animate={{
                opacity: open ? 1 : 0.45,
                x: open ? 0 : 8,
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3.5 py-3",
                open
                  ? "border-[#e56b68]/28 bg-[#e56b68]/10"
                  : "border-white/8 bg-white/[0.02]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold",
                  open ? "bg-white text-[#1a1617]" : "bg-white/8 text-white/45"
                )}
              >
                {open ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-white">{stage.title}</p>
                <p className="text-[11px] text-white/40">{stage.detail}</p>
              </div>
              <span className="text-[10px] text-white/35">+{stage.xp}</span>
            </motion.div>
          );
        })}
      </div>
    </Shell>
  );
}

function MentorDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 5);
  const reply =
    "Use a Map for O(1) lookups. Store each value’s index, then check if `target - nums[i]` already exists.";
  const typed = reply.slice(0, Math.floor(progress * reply.length));
  return (
    <Shell className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
      <Panel className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] text-white/45">
          <Sparkles className="h-3.5 w-3.5 text-[#f3aaa0]" />
          AI Mentor · Debug
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3.5 py-3 text-[12px] leading-relaxed text-white/80">
          Why is my two-sum solution O(n²)? How do I make it faster?
        </div>
        <div className="rounded-2xl border border-[#e56b68]/25 bg-[#e56b68]/8 px-3.5 py-3 text-[12px] leading-relaxed text-white/90">
          {stage === 0 ? (
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:240ms]" />
            </span>
          ) : (
            typed
          )}
        </div>
      </Panel>
      <Panel className="font-mono text-[11px] leading-6 text-[#d7c7c2]">
        <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
          suggested.ts
        </p>
        <pre className="whitespace-pre-wrap text-[11px] text-[#f0d6cf]">
{`function twoSum(nums: number[], target: number) {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
}`}
        </pre>
        {stage >= 3 ? (
          <p className="mt-3 text-[11px] text-[#78d7a6]">
            Complexity drops from O(n²) → O(n)
          </p>
        ) : null}
      </Panel>
    </Shell>
  );
}

function ProjectsDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 4);
  return (
    <Shell className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          Project brief
        </p>
        <p className="text-[15px] font-medium text-white">Auth-ready Notes App</p>
        <ul className="space-y-2 text-[12px] text-white/55">
          {[
            "Protected routes",
            "Create / edit notes",
            "Optimistic UI",
            "Deploy checklist",
          ].map((req, i) => (
            <li key={req} className="flex items-center gap-2">
              <CheckCircle2
                className={cn(
                  "h-3.5 w-3.5",
                  stage > i ? "text-[#78d7a6]" : "text-white/25"
                )}
              />
              {req}
            </li>
          ))}
        </ul>
        <span
          className={cn(
            "mt-2 inline-flex h-9 items-center rounded-full px-4 text-[11px] font-semibold transition",
            stage >= 3
              ? "bg-[#78d7a6] text-[#102418]"
              : "bg-white text-[#1a1617]"
          )}
        >
          {stage >= 3 ? "Submitted" : "Submit project"}
        </span>
      </Panel>
      <Panel>
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/35">
          <span>Preview</span>
          <span>Live</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[#2a2224] to-[#151516] p-4">
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <div className="h-2 w-24 rounded bg-white/20" />
            <div className="mt-3 space-y-2">
              <div className="h-8 rounded-lg bg-white/8" />
              <div className="h-8 rounded-lg bg-white/8" />
              <div
                className={cn(
                  "h-8 rounded-lg transition",
                  stage >= 2
                    ? "bg-gradient-to-r from-[#db5b65]/70 to-[#f1a379]/70"
                    : "bg-white/8"
                )}
              />
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] text-white/40">
            {stage >= 1
              ? "POST /api/notes → 201 Created"
              : "Waiting for first request…"}
          </p>
        </div>
      </Panel>
    </Shell>
  );
}

function HubDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 4);
  return (
    <Shell className="grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel className="space-y-2">
        {["System Design", "Auth Architecture", "Postgres Patterns"].map(
          (title, i) => (
            <div
              key={title}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-[12px]",
                stage === i
                  ? "border-[#e56b68]/35 bg-[#e56b68]/12 text-white"
                  : "border-white/8 text-white/45"
              )}
            >
              {title}
            </div>
          )
        )}
      </Panel>
      <Panel>
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium text-white">Auth Architecture</p>
          <div className="flex items-center gap-2 text-white/45">
            <Bookmark
              className={cn("h-3.5 w-3.5", stage >= 2 && "text-[#f3aaa0]")}
            />
            <FileText className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-[88%] rounded bg-white/8" />
          <div className="h-2 w-[72%] rounded bg-white/8" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Client", "API", "DB"].map((node, i) => (
            <div
              key={node}
              className={cn(
                "rounded-xl border border-white/8 px-2 py-4 text-center text-[11px] text-white/50",
                stage >= i && "border-[#e56b68]/30 text-white"
              )}
            >
              {node}
            </div>
          ))}
        </div>
        {stage >= 3 ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-[#f3aaa0]">
            <Download className="h-3.5 w-3.5" />
            Guide exported as PDF
          </p>
        ) : null}
      </Panel>
    </Shell>
  );
}

function CertsDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 5);
  return (
    <Shell>
      <AnimatePresence mode="wait">
        {stage < 2 ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Panel>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                Assessment · JavaScript Basic
              </p>
              <p className="mt-3 text-[15px] font-medium text-white">
                Which method creates a shallow copy of an array?
              </p>
              <div className="mt-4 grid gap-2">
                {["array.copy()", "array.slice()", "array.cut()", "array.clone()"].map(
                  (option, i) => (
                    <div
                      key={option}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-[12px]",
                        stage >= 1 && i === 1
                          ? "border-[#78d7a6]/45 bg-[#78d7a6]/12 text-white"
                          : "border-white/8 text-white/55"
                      )}
                    >
                      {option}
                    </div>
                  )
                )}
              </div>
            </Panel>
          </motion.div>
        ) : (
          <motion.div
            key="cert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Panel className="bg-gradient-to-br from-[#2a2224] to-[#151516]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#f3aaa0]">
                    Credential verified
                  </p>
                  <p className="mt-2 text-[18px] font-medium text-white">
                    JavaScript (Basic)
                  </p>
                  <p className="mt-1 text-[12px] text-white/45">
                    Score 92% · ID SB-JS-8F2K
                  </p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-[#78d7a6]" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1a1617]">
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[11px] text-white/70",
                    stage >= 4 && "border-[#6b8cff]/40 text-white"
                  )}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share on LinkedIn
                </span>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function ProfileDemo({ progress }: { progress: number }) {
  const stage = stageFromProgress(progress, 4);
  return (
    <Shell className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
      <Panel>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#db5b65] to-[#f1a379] text-[14px] font-bold text-white">
            AR
          </div>
          <div>
            <p className="text-[15px] font-medium text-white">Alex Rivera</p>
            <p className="text-[11px] text-white/40">Full Stack · AI track</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["12", "Projects"],
            ["4", "Certs"],
            ["86%", "Ready"],
          ].map(([value, label], i) => (
            <div
              key={label}
              className={cn(
                "rounded-xl border border-white/8 py-3",
                stage >= i && "border-[#e56b68]/28"
              )}
            >
              <p className="text-[15px] font-semibold text-white">{value}</p>
              <p className="text-[9px] text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          Showcase
        </p>
        <div className="mt-3 space-y-2">
          {[
            "Notes App · shipped",
            "JS Basic credential",
            "System Design guide notes",
          ].map((item, i) => (
            <div
              key={item}
              className={cn(
                "rounded-xl border border-white/8 px-3 py-2.5 text-[12px] text-white/50",
                stage >= i && "text-white"
              )}
            >
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}
