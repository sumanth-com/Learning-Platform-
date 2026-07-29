"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Lightbulb,
  Play,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CertLandingPage } from "@/components/certifications/cert-landing-page";
import {
  CertPretestFrame,
  PretestGhostButton,
  PretestPrimaryButton,
  PretestStatRow,
} from "@/components/certifications/cert-pretest-frame";
import { CertificateDocument } from "@/components/certifications/certificate-document";
import { CertificateNameModal } from "@/components/certifications/certificate-name-modal";
import { ConfirmDetailsModal } from "@/components/certifications/confirm-details-modal";
import { SubmitTestConfirmModal } from "@/components/certifications/submit-test-confirm-modal";
import { RetestCooldownCard } from "@/components/certifications/retest-cooldown-card";
import { CertMonacoEditor } from "@/components/certifications/cert-monaco-editor";
import { useCertSession } from "@/features/certifications/hooks/use-cert-session";
import {
  runCodeTests,
  scoreFromTestResults,
} from "@/features/certifications/lib/code-runner";
import {
  CERT_FLOW,
  questionSlug,
} from "@/features/certifications/lib/paths";
import {
  EDITOR_LANGUAGES,
  languageMeta,
  type EditorLanguageId,
} from "@/features/certifications/lib/editor-languages";
import {
  certificateVerifyUrl,
  emailShareUrl,
  linkedInShareUrl,
  xShareUrl,
} from "@/features/certifications/lib/share";
import { printCertificateLandscape } from "@/features/certifications/lib/print-certificate";
import type { AssessmentQuestion, TestRunResult } from "@/features/certifications/types";
import { cn } from "@/lib/utils";

function unansweredCount(
  questions: AssessmentQuestion[],
  completedQuestionIds: string[]
) {
  const done = new Set(completedQuestionIds);
  return questions.filter((q) => !done.has(q.id)).length;
}

function hasDraftAnswer(
  questionId: string,
  answers: Record<string, string | number>
) {
  const v = answers[questionId];
  return typeof v === "string" && v.trim().length > 40;
}

function usePersistStep(step: string) {
  const { persistPath, ready } = useCertSession();
  const persistPathRef = useRef(persistPath);
  persistPathRef.current = persistPath;

  useEffect(() => {
    if (!ready) return;
    persistPathRef.current(step);
  }, [ready, step]);
}

export function CertLandingScreen() {
  const router = useRouter();
  const {
    certification,
    locked,
    lockedReason,
    earned,
    result,
    ready,
    cooldownMs,
  } = useCertSession();
  usePersistStep("landing");

  useEffect(() => {
    if (!ready) return;
    if (earned) {
      router.replace(CERT_FLOW.certificate(certification.id));
      return;
    }
    // Cooldown: timer-only page — do not open assessment content
    if (locked && cooldownMs > 0) {
      router.replace(CERT_FLOW.retest(certification.id));
      return;
    }
    if (result) {
      router.replace(CERT_FLOW.results(certification.id));
    }
  }, [
    ready,
    earned,
    result,
    locked,
    cooldownMs,
    router,
    certification.id,
  ]);

  if (locked && cooldownMs > 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-zinc-500">
        Opening timer…
      </div>
    );
  }

  return (
    <CertLandingPage
      certification={certification}
      locked={locked}
      lockedReason={lockedReason}
      onStart={() => router.push(CERT_FLOW.brief(certification.id))}
    />
  );
}

export function CertBriefScreen() {
  const router = useRouter();
  const { certification, confirmedName, profileName } = useCertSession();
  usePersistStep("brief");

  return (
    <CertPretestFrame
      certification={certification}
      greeting={confirmedName || profileName}
      step="welcome"
      footer={
        <div className="flex flex-wrap gap-3">
          <PretestPrimaryButton
            onClick={() => router.push(CERT_FLOW.plan(certification.id))}
          >
            Continue
          </PretestPrimaryButton>
          <PretestGhostButton
            onClick={() => {
              const slug = questionSlug(certification.questions[0]!);
              toast.message("Sample mode — practice one question");
              router.push(
                `${CERT_FLOW.problem(certification.id, slug)}?sample=1`
              );
            }}
          >
            Try a sample
          </PretestGhostButton>
        </div>
      }
    >
      <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">
        Before you begin
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
        A few ground rules so your {certification.shortTitle} run stays fair and
        focused.
      </p>
      <ul className="mt-4 space-y-2.5">
        {[
          "The timer starts once you enter the test and cannot be paused.",
          "Use a stable connection — progress saves as you go.",
          "Optional: try a sample question first to feel the editor.",
        ].map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-[13px] leading-relaxed text-foreground"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {line}
          </li>
        ))}
      </ul>
      <PretestStatRow
        durationMinutes={certification.durationMinutes}
        questionCount={certification.questionCount}
      />
    </CertPretestFrame>
  );
}

export function CertPlanScreen() {
  const router = useRouter();
  const { certification, confirmedName, profileName } = useCertSession();
  usePersistStep("plan");

  return (
    <CertPretestFrame
      certification={certification}
      greeting={confirmedName || profileName}
      step="sections"
      footer={
        <PretestPrimaryButton
          onClick={() => router.push(CERT_FLOW.confirm(certification.id))}
        >
          Continue
        </PretestPrimaryButton>
      }
    >
      <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">
        What’s on the test
      </h1>
      <p className="mt-1.5 text-[14px] text-muted-foreground">
        One coding section · {certification.questionCount} challenges
      </p>
      <div className="mt-4 rounded-xl border border-border bg-muted/60 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Section
            </p>
            <p className="mt-1 text-[15px] font-medium text-foreground">
              Coding challenges
            </p>
          </div>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-[12px] font-medium text-foreground">
            {certification.questionCount} Qs
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {certification.questions.map((q, i) => (
          <li
            key={q.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[12px] font-semibold text-foreground">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-foreground">
                {q.title ?? `Challenge ${i + 1}`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Coding · Run & submit
              </p>
            </div>
          </li>
        ))}
      </ul>
    </CertPretestFrame>
  );
}

export function CertConfirmScreen() {
  const router = useRouter();
  const { certification, confirmedName, profileName, setConfirmedName } =
    useCertSession();
  usePersistStep("confirm");

  return (
    <div className="relative h-full min-h-0 bg-background">
      <ConfirmDetailsModal
        open
        defaultFullName={confirmedName || profileName}
        onCancel={() => router.push(CERT_FLOW.root(certification.id))}
        onStart={(fullName) => {
          setConfirmedName(fullName);
          router.push(CERT_FLOW.honor(certification.id));
        }}
      />
    </div>
  );
}

export function CertHonorScreen() {
  const router = useRouter();
  const {
    certification,
    confirmedName,
    agreeHonor,
    setAgreeHonor,
    agreeTerms,
    setAgreeTerms,
  } = useCertSession();
  usePersistStep("honor");

  return (
    <CertPretestFrame
      certification={certification}
      greeting={confirmedName}
      step="declaration"
      footer={
        <PretestPrimaryButton
          disabled={!agreeHonor || !agreeTerms}
          onClick={() => router.push(CERT_FLOW.ready(certification.id))}
        >
          Continue
        </PretestPrimaryButton>
      }
    >
      <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">
        Honor code
      </h1>
      <p className="mt-1.5 text-[14px] text-muted-foreground">
        Confirm these before we open your coding environment.
      </p>
      <label className="mt-4 flex cursor-pointer gap-3 rounded-xl border border-border bg-muted/50 p-3.5 text-[13px] leading-relaxed text-foreground transition hover:border-foreground/20">
        <input
          type="checkbox"
          checked={agreeHonor}
          onChange={(e) => setAgreeHonor(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          I will not copy code from others or AI tools, and I will not share
          questions or answers from this assessment.
        </span>
      </label>
      <label className="mt-2.5 flex cursor-pointer gap-3 rounded-xl border border-border bg-muted/50 p-3.5 text-[13px] leading-relaxed text-foreground transition hover:border-foreground/20">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          I agree to SupraBase&apos;s Terms of Service and Privacy Policy.
        </span>
      </label>
    </CertPretestFrame>
  );
}

export function CertReadyScreen() {
  const router = useRouter();
  const { certification, startTimer } = useCertSession();
  const [envReady, setEnvReady] = useState(false);
  usePersistStep("ready");

  useEffect(() => {
    const t = window.setTimeout(() => setEnvReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <CertPretestFrame
      certification={certification}
      step="environment"
      footer={
        <PretestPrimaryButton
          disabled={!envReady}
          onClick={() => {
            startTimer();
            toast.success("Test started — timer is running");
            router.push(CERT_FLOW.lobby(certification.id));
          }}
        >
          Enter the test
        </PretestPrimaryButton>
      }
    >
      <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">
        Spinning up your space
      </h1>
      <p className="mt-1.5 text-[14px] text-muted-foreground">
        Editor, runner, and timer — almost ready.
      </p>
      <ul className="mt-5 space-y-2.5">
        {["Code editor online", "Test runner connected", "Session timer armed"].map(
          (label, i) => {
            const ready = envReady || i === 0;
            return (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3"
              >
                {ready ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 animate-pulse text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-[14px]",
                    ready ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          }
        )}
      </ul>
      <PretestStatRow
        durationMinutes={certification.durationMinutes}
        questionCount={certification.questionCount}
      />
    </CertPretestFrame>
  );
}

export function CertLobbyScreen() {
  const router = useRouter();
  const {
    certification,
    answers,
    completedQuestionIds,
    remaining,
    finishTest,
    ready,
    locked,
    result,
  } = useCertSession();
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  usePersistStep("lobby");

  useEffect(() => {
    if (!ready) return;
    if (result || locked) {
      router.replace(CERT_FLOW.results(certification.id));
    }
  }, [ready, result, locked, router, certification.id]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const open = unansweredCount(certification.questions, completedQuestionIds);
  const doneSet = new Set(completedQuestionIds);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Question lobby
          </p>
          <p className="text-[14px] font-medium text-foreground">
            {certification.shortTitle}
          </p>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {mins}:{secs.toString().padStart(2, "0")}
        </p>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <p className="text-[13px] text-muted-foreground">
          Pick a challenge · run your code · mark complete · submit when ready
        </p>
        <ul className="mt-4 space-y-3">
          {certification.questions.map((q, i) => {
            const done = doneSet.has(q.id);
            const draft = !done && hasDraftAnswer(q.id, answers);
            const slug = questionSlug(q);
            return (
              <li
                key={q.id}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
                  done
                    ? "border-primary/35 bg-primary/[0.04]"
                    : "border-border"
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-semibold",
                      done
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-foreground">
                      {q.title ?? `Challenge ${i + 1}`}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      Coding
                      {done
                        ? " · Completed"
                        : draft
                          ? " · In progress"
                          : ""}
                    </p>
                  </div>
                </div>
                <Link
                  href={CERT_FLOW.problem(certification.id, slug)}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-2.5 text-[13px] font-bold transition",
                    done
                      ? "border border-border bg-background text-foreground hover:bg-muted"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {done ? "Review" : draft ? "Continue" : "Solve"}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex shrink-0 justify-end border-t border-border px-4 py-4 sm:px-6">
        <PretestGhostButton onClick={() => setConfirmSubmit(true)}>
          Submit test
        </PretestGhostButton>
      </div>
      <SubmitTestConfirmModal
        open={confirmSubmit}
        questionCount={certification.questionCount}
        unansweredCount={open}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => {
          setConfirmSubmit(false);
          finishTest();
        }}
      />
    </div>
  );
}

export function CertProblemScreen({
  question,
  index,
  sample,
}: {
  question: AssessmentQuestion;
  index: number;
  sample?: boolean;
}) {
  const router = useRouter();
  const {
    certification,
    answers,
    setAnswer,
    codeLanguages,
    setQuestionLanguage,
    completedQuestionIds,
    markQuestionComplete,
    remaining,
    finishTest,
  } = useCertSession();
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [openHint, setOpenHint] = useState<number | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  usePersistStep(`problems/${questionSlug(question)}`);

  const language = (codeLanguages[question.id] ||
    "javascript") as EditorLanguageId;
  const langMeta = languageMeta(language);
  const isComplete = completedQuestionIds.includes(question.id);

  const codeValue =
    typeof answers[question.id] === "string"
      ? String(answers[question.id])
      : question.starterCode ?? "";

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const canComplete =
    !sample &&
    (isComplete ||
      (langMeta.runnable ? hasRun : codeValue.trim().length > 40));

  const runTests = (mode: "run" | "complete" = "run") => {
    if (!langMeta.runnable && mode === "run") {
      toast.message(
        `Live tests run in JavaScript or TypeScript. Switch language to grade automatically — your ${langMeta.label} draft is still saved.`
      );
      return;
    }

    if (langMeta.runnable) {
      setRunning(true);
      window.setTimeout(() => {
        const results = runCodeTests(codeValue, question);
        setTestResults(results);
        setHasRun(true);
        setRunning(false);
        const score = scoreFromTestResults(results);
        const passCount = results.filter((r) => r.passed).length;

        if (mode === "complete") {
          markQuestionComplete(question.id);
          toast.success(
            score >= 70
              ? `Completed · ${passCount}/${results.length} tests passed`
              : `Completed · ${passCount}/${results.length} tests — you can still review later`
          );
          router.push(CERT_FLOW.lobby(certification.id));
          return;
        }

        toast.message(`${passCount}/${results.length} test cases passed`);
      }, 350);
      return;
    }

    if (mode === "complete") {
      markQuestionComplete(question.id);
      toast.success("Challenge marked complete");
      router.push(CERT_FLOW.lobby(certification.id));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 bg-card px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                sample
                  ? CERT_FLOW.brief(certification.id)
                  : CERT_FLOW.lobby(certification.id)
              )
            }
            className="inline-flex items-center gap-1 text-[12px] text-zinc-400 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {sample ? "Brief" : "Lobby"}
          </button>
          <span className="text-zinc-600">/</span>
          <p className="truncate text-[13px] font-medium text-zinc-200">
            {question.title}
          </p>
          {sample ? (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
              Sample
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-[12px] text-zinc-400">
          {!sample ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2 py-1">
              <Clock className="h-3.5 w-3.5" />
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          ) : null}
          {!sample ? (
            <button
              type="button"
              onClick={() => setConfirmSubmit(true)}
              className="rounded-md border border-primary/50 px-3 py-1.5 font-medium text-primary"
            >
              Submit Test
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex max-h-[45vh] w-full shrink-0 flex-col overflow-y-auto border-b border-zinc-800 lg:max-h-none lg:w-[44%] lg:border-b-0 lg:border-r">
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Problem {index + 1} · Coding
            </p>
            <h2 className="mt-2 text-[22px] font-semibold tracking-tight">
              {question.title}
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-[14px] leading-relaxed text-zinc-300">
              {question.prompt}
            </p>
            {question.constraints?.length ? (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Constraints
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-zinc-400">
                  {question.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {question.examples?.map((ex, i) => (
              <div
                key={i}
                className="mt-4 rounded-lg border border-zinc-800 bg-muted p-3 font-mono text-[12px] text-zinc-300"
              >
                <p>
                  <span className="text-zinc-500">Input: </span>
                  {ex.input}
                </p>
                <p className="mt-1">
                  <span className="text-zinc-500">Output: </span>
                  {ex.output}
                </p>
                {ex.explanation ? (
                  <p className="mt-1 text-zinc-500">{ex.explanation}</p>
                ) : null}
              </div>
            ))}

            {question.hints?.length ? (
              <div className="mt-6">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  Hints
                </p>
                <ul className="mt-2 space-y-2">
                  {question.hints.map((hint, i) => {
                    const open = openHint === i;
                    return (
                      <li
                        key={i}
                        className="overflow-hidden rounded-xl border border-zinc-800 bg-muted"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenHint(open ? null : i)}
                          className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-[13px] text-zinc-300 hover:bg-white/[0.03]"
                        >
                          <span>Hint {i + 1}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-zinc-500 transition",
                              open && "rotate-180"
                            )}
                          />
                        </button>
                        {open ? (
                          <p className="border-t border-zinc-800 px-3.5 py-3 text-[13px] leading-relaxed text-zinc-400">
                            {hint}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted">
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2">
            <label className="relative">
              <span className="sr-only">Language</span>
              <select
                value={language}
                onChange={(e) =>
                  setQuestionLanguage(question.id, e.target.value)
                }
                className="h-8 appearance-none rounded-md border border-zinc-700 bg-card py-1 pl-2.5 pr-8 text-[12px] font-medium text-zinc-200 outline-none hover:border-zinc-500"
              >
                {EDITOR_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </label>
            <button
              type="button"
              disabled={running}
              onClick={() => runTests("run")}
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-zinc-700 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </button>
            {!sample ? (
              <button
                type="button"
                disabled={running || !canComplete}
                onClick={() => runTests("complete")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-bold disabled:opacity-50",
                  isComplete
                    ? "border border-primary/50 bg-primary/10 text-primary"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isComplete ? "Completed" : "Complete"}
              </button>
            ) : null}
            <span className="text-[11px] text-zinc-500">
              {langMeta.runnable
                ? isComplete
                  ? "Marked complete · auto-saved"
                  : hasRun
                    ? "Run passed — click Complete when you’re done"
                    : "Run tests, then mark Complete"
                : `${langMeta.label} editor · auto-saved · switch to JS/TS to run tests`}
            </span>
          </div>
          <div className="min-h-0 flex-1 p-2">
            <CertMonacoEditor
              key={`${question.id}-${language}`}
              value={codeValue || question.starterCode || ""}
              language={language}
              onChange={(v) => setAnswer(question.id, v)}
              height="100%"
              className="h-full min-h-[300px]"
            />
          </div>
          <div className="max-h-[28vh] shrink-0 overflow-y-auto border-t border-zinc-800 bg-card px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Testcases
            </p>
            {testResults.length === 0 ? (
              <p className="mt-2 text-[12px] text-zinc-500">
                Click Run to execute sample tests, then Complete to mark this
                challenge done in the lobby.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {testResults
                  .filter((r) => !r.hidden || r.passed === false)
                  .map((r) => (
                    <li
                      key={r.id}
                      className="rounded-md border border-zinc-800 bg-muted px-3 py-2 text-[12px]"
                    >
                      <div className="flex items-center gap-2">
                        {r.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                        <span className="font-medium text-zinc-200">
                          {r.hidden ? "Hidden case" : r.name}
                        </span>
                        <span
                          className={cn(
                            "ml-auto font-semibold",
                            r.passed ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          {r.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      {!r.passed ? (
                        <div className="mt-1.5 space-y-0.5 font-mono text-[11px] text-zinc-500">
                          {r.error ? <p>Error: {r.error}</p> : null}
                          <p>Expected: {r.expected}</p>
                          <p>Actual: {r.actual || "—"}</p>
                        </div>
                      ) : null}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <SubmitTestConfirmModal
        open={confirmSubmit}
        questionCount={certification.questionCount}
        unansweredCount={unansweredCount(
          certification.questions,
          completedQuestionIds
        )}
        onCancel={() => setConfirmSubmit(false)}
        onConfirm={() => {
          setConfirmSubmit(false);
          finishTest();
        }}
      />
    </div>
  );
}

export function CertResultsScreen() {
  const router = useRouter();
  const {
    certification,
    result,
    confirmedName,
    profileName,
    earned,
    awardAndShowCertificate,
    beginRetest,
    cooldownMs,
    ready,
  } = useCertSession();
  const [nameModal, setNameModal] = useState(false);
  usePersistStep("results");

  useEffect(() => {
    if (!ready) return;
    if (!result) {
      router.replace(CERT_FLOW.root(certification.id));
      return;
    }
    // During cooldown, only show the dedicated timer page — no results UI
    if (!result.passed && cooldownMs > 0) {
      router.replace(CERT_FLOW.retest(certification.id));
    }
  }, [ready, result, cooldownMs, router, certification.id]);

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading results…
      </div>
    );
  }

  if (!result.passed && cooldownMs > 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Opening timer…
      </div>
    );
  }

  const waitLeft = cooldownMs;

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center overflow-hidden bg-background px-5 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {result.passed ? (
          <CheckCircle2 className="h-11 w-11 text-emerald-500" />
        ) : waitLeft <= 0 ? (
          <CheckCircle2 className="h-11 w-11 text-emerald-500" />
        ) : (
          <XCircle className="h-11 w-11 text-rose-500" />
        )}
        <h1 className="mt-2.5 text-[22px] font-semibold tracking-tight">
          {result.passed
            ? "Certification earned"
            : waitLeft <= 0
              ? "Ready to certify"
              : "Not certified yet"}
        </h1>
        {result.passed || waitLeft > 0 ? (
          <>
            <p className="mt-1 text-[30px] font-semibold leading-none">
              {result.score}%
            </p>
            <p className="mt-1.5 text-[12px] text-muted-foreground">
              {result.correct}/{certification.questionCount} questions cleared ·
              Pass mark {certification.passingScore}%
            </p>
          </>
        ) : (
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Cooldown is over. Start the assessment fresh — same path as Get
            Certified.
          </p>
        )}

        {!result.passed && waitLeft > 0 ? (
          <RetestCooldownCard cooldownMs={waitLeft} className="mt-5" />
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {result.passed ? (
            earned ? (
              <Link
                href={CERT_FLOW.certificate(certification.id)}
                className="rounded-md bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/90"
              >
                Download certificate
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setNameModal(true)}
                className="rounded-md bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/90"
              >
                Generate certificate
              </button>
            )
          ) : waitLeft <= 0 ? (
            <button
              type="button"
              onClick={beginRetest}
              className="rounded-md bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/90"
            >
              Get Certified
            </button>
          ) : null}
          <Link
            href="/certifications"
            className="rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted/50"
          >
            Back to certifications
          </Link>
        </div>
      </div>

      <CertificateNameModal
        open={nameModal}
        defaultName={confirmedName || profileName}
        onCancel={() => setNameModal(false)}
        onGenerate={(name) => {
          setNameModal(false);
          awardAndShowCertificate(name);
        }}
      />
    </div>
  );
}

export function CertCertificateScreen() {
  const router = useRouter();
  const { certification, earned, ready } = useCertSession();
  usePersistStep("certificate");

  useEffect(() => {
    if (!ready) return;
    if (!earned) {
      router.replace(CERT_FLOW.results(certification.id));
    }
  }, [ready, earned, router, certification.id]);

  if (!earned) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading certificate…
      </div>
    );
  }

  const downloadPdf = async () => {
    try {
      toast.message("Preparing landscape PDF…");
      await printCertificateLandscape("certificate-print");
    } catch (err) {
      // Fallback: in-page landscape print
      document.body.classList.add("printing-certificate");
      const cleanup = () => {
        document.body.classList.remove("printing-certificate");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      window.setTimeout(() => window.print(), 80);
      toast.message(
        err instanceof Error
          ? err.message
          : "Use landscape orientation in the print dialog"
      );
    }
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background text-foreground">
      <div className="cert-print-area mx-auto w-full max-w-4xl p-6">
        <div className="cert-no-print mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-muted-foreground">
              Your verified certificate
            </p>
            <h1 className="text-[18px] font-semibold text-foreground">
              {earned.title}
            </h1>
          </div>
          <Link
            href="/certifications"
            className="text-[13px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Back to certifications
          </Link>
        </div>

        <CertificateDocument certificate={earned} id="certificate-print" />

        <div className="cert-no-print mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={downloadPdf}
            className="rounded-md bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/90"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(
                certificateVerifyUrl(earned.id)
              );
              toast.success("Verification link copied");
            }}
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
          >
            Copy verification link
          </button>
          <a
            href={linkedInShareUrl(earned)}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
          >
            LinkedIn
          </a>
          <a
            href={xShareUrl(earned)}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
          >
            X
          </a>
          <a
            href={emailShareUrl(earned)}
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
