"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCertificateId,
  useCertifications,
} from "@/features/certifications/hooks/use-certifications";
import {
  runCodeTests,
  scoreFromTestResults,
} from "@/features/certifications/lib/code-runner";
import { CERT_FLOW } from "@/features/certifications/lib/paths";
import type {
  AssessmentAttempt,
  Certification,
  EarnedCertificate,
} from "@/features/certifications/types";
import {
  canRetryFailedAttempt,
  CERT_RETRY_COOLDOWN_HOURS,
  formatCooldown,
  msUntilRetry,
} from "@/features/certifications/lib/retry-cooldown";
import { notifyCertificationPassed } from "@/lib/notifications";
import { PORTAL_ROUTES } from "@/features/portal/types";
import {
  draftKey,
  isEditorLanguage,
  starterForLanguage,
  type EditorLanguageId,
} from "@/features/certifications/lib/editor-languages";

type CertSessionValue = {
  certification: Certification;
  profileName: string;
  ready: boolean;
  answers: Record<string, string | number>;
  setAnswer: (questionId: string, value: string) => void;
  codeLanguages: Record<string, string>;
  codeDrafts: Record<string, string>;
  setQuestionLanguage: (questionId: string, language: string) => void;
  completedQuestionIds: string[];
  markQuestionComplete: (questionId: string) => void;
  remaining: number;
  confirmedName: string;
  setConfirmedName: (name: string) => void;
  agreeHonor: boolean;
  setAgreeHonor: (v: boolean) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  earned: EarnedCertificate | null;
  result: { score: number; correct: number; passed: boolean } | null;
  locked: boolean;
  lockedReason: string;
  cooldownMs: number;
  startTimer: () => void;
  finishTest: () => void;
  beginRetest: () => void;
  awardAndShowCertificate: (name: string) => void;
  persistPath: (path: string) => void;
  isTimerLive: boolean;
};

const CertSessionContext = createContext<CertSessionValue | null>(null);

export function CertSessionProvider({
  certification,
  profileName,
  children,
}: {
  certification: Certification;
  profileName: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { getAttempt, saveAttempt, awardCertificate, clearAttempt, ready, state } =
    useCertifications();

  const existing = getAttempt(certification.id);
  const existingCert =
    state.certificates.find((c) => c.certificationId === certification.id) ??
    null;

  const [answers, setAnswers] = useState<Record<string, string | number>>(
    () => existing?.answers ?? {}
  );
  const [confirmedName, setConfirmedNameState] = useState(
    () => existing?.confirmedName || profileName
  );
  const [agreeHonor, setAgreeHonorState] = useState(
    () => existing?.agreeHonor ?? false
  );
  const [agreeTerms, setAgreeTermsState] = useState(
    () => existing?.agreeTerms ?? false
  );
  const [codeLanguages, setCodeLanguages] = useState<Record<string, string>>(
    () => existing?.codeLanguages ?? {}
  );
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>(
    () => existing?.codeDrafts ?? {}
  );
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(
    () => existing?.completedQuestionIds ?? []
  );
  const [timerEndsAt, setTimerEndsAt] = useState<number | null>(
    () => existing?.timerEndsAt ?? null
  );
  const [remaining, setRemaining] = useState(() => {
    if (existing?.timerEndsAt) {
      return Math.max(0, Math.floor((existing.timerEndsAt - Date.now()) / 1000));
    }
    return existing?.remainingSeconds ?? certification.durationMinutes * 60;
  });
  const [earned, setEarned] = useState<EarnedCertificate | null>(
    () => existingCert
  );
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    passed: boolean;
  } | null>(() =>
    existing?.score != null
      ? {
          score: existing.score,
          correct: existing.correctCount ?? 0,
          passed: existing.status === "passed",
        }
      : null
  );

  const hydratedRef = useRef(false);

  // Keep a mutable snapshot so persist helpers stay referentially stable
  const snap = useRef({
    answers,
    remaining,
    timerEndsAt,
    confirmedName,
    agreeHonor,
    agreeTerms,
    codeLanguages,
    codeDrafts,
    completedQuestionIds,
  });
  snap.current = {
    answers,
    remaining,
    timerEndsAt,
    confirmedName,
    agreeHonor,
    agreeTerms,
    codeLanguages,
    codeDrafts,
    completedQuestionIds,
  };

  const saveAttemptRef = useRef(saveAttempt);
  saveAttemptRef.current = saveAttempt;
  const getAttemptRef = useRef(getAttempt);
  getAttemptRef.current = getAttempt;

  const writeAttempt = useCallback(
    (patch: Partial<AssessmentAttempt>) => {
      const current = getAttemptRef.current(certification.id);
      const s = snap.current;
      const next: AssessmentAttempt = {
        certificationId: certification.id,
        status: current?.status ?? "in-progress",
        answers: s.answers,
        startedAt: current?.startedAt ?? new Date().toISOString(),
        remainingSeconds: s.remaining,
        timerEndsAt: s.timerEndsAt ?? undefined,
        confirmedName: s.confirmedName,
        agreeHonor: s.agreeHonor,
        agreeTerms: s.agreeTerms,
        codeLanguages: s.codeLanguages,
        codeDrafts: s.codeDrafts,
        completedQuestionIds: s.completedQuestionIds,
        lastPath: current?.lastPath,
        score: current?.score,
        correctCount: current?.correctCount,
        finishedAt: current?.finishedAt,
        ...patch,
      };
      saveAttemptRef.current(next);
    },
    [certification.id]
  );

  // Hydrate once after localStorage is ready
  useEffect(() => {
    if (!ready || hydratedRef.current) return;
    hydratedRef.current = true;
    const attempt = getAttemptRef.current(certification.id);
    const cert = state.certificates.find(
      (c) => c.certificationId === certification.id
    );
    if (cert) setEarned(cert);
    if (!attempt) return;
    setAnswers(attempt.answers ?? {});
    if (attempt.confirmedName) setConfirmedNameState(attempt.confirmedName);
    setAgreeHonorState(attempt.agreeHonor ?? false);
    setAgreeTermsState(attempt.agreeTerms ?? false);
    setCodeLanguages(attempt.codeLanguages ?? {});
    setCodeDrafts(attempt.codeDrafts ?? {});
    setCompletedQuestionIds(attempt.completedQuestionIds ?? []);
    if (attempt.timerEndsAt) {
      setTimerEndsAt(attempt.timerEndsAt);
      setRemaining(
        Math.max(0, Math.floor((attempt.timerEndsAt - Date.now()) / 1000))
      );
    } else if (attempt.remainingSeconds != null) {
      setRemaining(attempt.remainingSeconds);
    }
    if (attempt.score != null) {
      setResult({
        score: attempt.score,
        correct: attempt.correctCount ?? 0,
        passed: attempt.status === "passed",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, certification.id]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (existing?.status !== "failed") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [existing?.status]);

  const cooldownMs =
    existing?.status === "failed"
      ? msUntilRetry(existing.finishedAt, now)
      : 0;
  const lockedByPass = existing?.status === "passed" || Boolean(existingCert);
  const lockedByCooldown =
    existing?.status === "failed" && cooldownMs > 0;
  const locked = lockedByPass || lockedByCooldown;
  const lockedReason = lockedByPass
    ? "You’ve already earned this certification."
    : `Retest unlocks in ${formatCooldown(cooldownMs)}. Failed attempts require a ${CERT_RETRY_COOLDOWN_HOURS}-hour wait.`;

  const setAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        snap.current.answers = next;
        const lang = (snap.current.codeLanguages[questionId] ||
          "javascript") as EditorLanguageId;
        const key = draftKey(questionId, lang);
        const drafts = { ...snap.current.codeDrafts, [key]: value };
        snap.current.codeDrafts = drafts;
        setCodeDrafts(drafts);
        const current = getAttemptRef.current(certification.id);
        writeAttempt({
          answers: next,
          codeDrafts: drafts,
          status:
            current?.status === "passed" || current?.status === "failed"
              ? current.status
              : "in-progress",
        });
        return next;
      });
    },
    [certification.id, writeAttempt]
  );

  const setQuestionLanguage = useCallback(
    (questionId: string, language: string) => {
      if (!isEditorLanguage(language)) return;
      const lang = language as EditorLanguageId;
      const q = certification.questions.find((item) => item.id === questionId);
      const key = draftKey(questionId, lang);
      const existingDraft = snap.current.codeDrafts[key];
      const code =
        existingDraft ??
        starterForLanguage(q?.entryFn, lang, q?.starterCode);

      const langs = { ...snap.current.codeLanguages, [questionId]: lang };
      const drafts = { ...snap.current.codeDrafts, [key]: code };
      const answersNext = { ...snap.current.answers, [questionId]: code };

      snap.current.codeLanguages = langs;
      snap.current.codeDrafts = drafts;
      snap.current.answers = answersNext;
      setCodeLanguages(langs);
      setCodeDrafts(drafts);
      setAnswers(answersNext);
      writeAttempt({
        codeLanguages: langs,
        codeDrafts: drafts,
        answers: answersNext,
      });
    },
    [certification.questions, writeAttempt]
  );

  const markQuestionComplete = useCallback(
    (questionId: string) => {
      setCompletedQuestionIds((prev) => {
        if (prev.includes(questionId)) return prev;
        const next = [...prev, questionId];
        snap.current.completedQuestionIds = next;
        writeAttempt({ completedQuestionIds: next });
        return next;
      });
    },
    [writeAttempt]
  );

  const setConfirmedName = useCallback(
    (name: string) => {
      setConfirmedNameState(name);
      snap.current.confirmedName = name;
      writeAttempt({ confirmedName: name });
    },
    [writeAttempt]
  );

  const setAgreeHonor = useCallback(
    (v: boolean) => {
      setAgreeHonorState(v);
      snap.current.agreeHonor = v;
      writeAttempt({ agreeHonor: v });
    },
    [writeAttempt]
  );

  const setAgreeTerms = useCallback(
    (v: boolean) => {
      setAgreeTermsState(v);
      snap.current.agreeTerms = v;
      writeAttempt({ agreeTerms: v });
    },
    [writeAttempt]
  );

  const persistPath = useCallback(
    (path: string) => {
      const current = getAttemptRef.current(certification.id);
      if (current?.lastPath === path) return;
      writeAttempt({ lastPath: path });
    },
    [certification.id, writeAttempt]
  );

  const startTimer = useCallback(() => {
    const ends = Date.now() + certification.durationMinutes * 60 * 1000;
    setTimerEndsAt(ends);
    setRemaining(certification.durationMinutes * 60);
    snap.current.timerEndsAt = ends;
    snap.current.remaining = certification.durationMinutes * 60;
    writeAttempt({
      status: "in-progress",
      timerEndsAt: ends,
      remainingSeconds: certification.durationMinutes * 60,
      startedAt: new Date().toISOString(),
      lastPath: "lobby",
    });
  }, [certification.durationMinutes, writeAttempt]);

  const finishTest = useCallback(() => {
    const s = snap.current;
    let total = 0;
    let correct = 0;
    for (const q of certification.questions) {
      const src =
        typeof s.answers[q.id] === "string"
          ? String(s.answers[q.id])
          : q.starterCode ?? "";
      const results = runCodeTests(src, q);
      const score = scoreFromTestResults(results);
      total += score;
      if (score >= 70) correct += 1;
    }
    const avg = Math.round(total / Math.max(certification.questions.length, 1));
    const passed = avg >= certification.passingScore;
    setResult({ score: avg, correct, passed });
    const current = getAttemptRef.current(certification.id);
    writeAttempt({
      status: passed ? "passed" : "failed",
      answers: s.answers,
      startedAt: current?.startedAt ?? new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      score: avg,
      correctCount: correct,
      remainingSeconds: 0,
      lastPath: "results",
    });
    toast[passed ? "success" : "message"](
      passed
        ? `Passed · ${avg}% — marked Done on Certifications`
        : `Scored ${avg}% — retest unlocks in ${CERT_RETRY_COOLDOWN_HOURS} hours`
    );
    if (passed) {
      notifyCertificationPassed({
        certificationId: certification.id,
        title: certification.shortTitle,
        score: avg,
      });
    }
    router.push(
      `${PORTAL_ROUTES.certifications}?done=${encodeURIComponent(certification.id)}`
    );
  }, [certification, router, writeAttempt]);

  const beginRetest = useCallback(() => {
    const attempt = getAttemptRef.current(certification.id);
    if (
      !canRetryFailedAttempt(attempt?.status, attempt?.finishedAt)
    ) {
      toast.message("Retest is still on cooldown");
      return;
    }
    clearAttempt(certification.id);
    setAnswers({});
    setCodeLanguages({});
    setCodeDrafts({});
    setCompletedQuestionIds([]);
    setTimerEndsAt(null);
    setRemaining(certification.durationMinutes * 60);
    setResult(null);
    setAgreeHonorState(false);
    setAgreeTermsState(false);
    snap.current.answers = {};
    snap.current.codeLanguages = {};
    snap.current.codeDrafts = {};
    snap.current.completedQuestionIds = [];
    snap.current.timerEndsAt = null;
    snap.current.remaining = certification.durationMinutes * 60;
    snap.current.agreeHonor = false;
    snap.current.agreeTerms = false;
    toast.message("Ready when you are — Get Certified");
    router.push(CERT_FLOW.root(certification.id));
  }, [certification.durationMinutes, certification.id, clearAttempt, router]);

  const finishTestRef = useRef(finishTest);
  finishTestRef.current = finishTest;

  useEffect(() => {
    if (!timerEndsAt) return;
    if (existing?.status === "passed" || existing?.status === "failed") return;

    const tick = () => {
      const left = Math.max(0, Math.floor((timerEndsAt - Date.now()) / 1000));
      setRemaining(left);
      snap.current.remaining = left;
      if (left <= 0) finishTestRef.current();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timerEndsAt, existing?.status]);

  const awardAndShowCertificate = useCallback(
    (name: string) => {
      if (earned) {
        router.push(CERT_FLOW.certificate(certification.id));
        return;
      }

      const score =
        result?.score ?? getAttemptRef.current(certification.id)?.score;
      if (score == null) {
        toast.message("Complete the assessment before generating a certificate");
        return;
      }

      const id = createCertificateId();
      const cert: EarnedCertificate = {
        id,
        certificationId: certification.id,
        recipientName: name,
        issuedAt: new Date().toISOString(),
        score,
        level: certification.level,
        technology: certification.categoryLabel,
        title: certification.title,
        verifyPath: `/verify/${id}`,
      };
      awardCertificate(cert, certification.xp, certification.shortTitle);
      setEarned(cert);
      setConfirmedNameState(name);
      snap.current.confirmedName = name;
      writeAttempt({ confirmedName: name, status: "passed", score });
      router.push(CERT_FLOW.certificate(certification.id));
    },
    [
      awardCertificate,
      certification,
      earned,
      result,
      router,
      writeAttempt,
    ]
  );

  const value = useMemo<CertSessionValue>(
    () => ({
      certification,
      profileName,
      ready,
      answers,
      setAnswer,
      codeLanguages,
      codeDrafts,
      setQuestionLanguage,
      completedQuestionIds,
      markQuestionComplete,
      remaining,
      confirmedName,
      setConfirmedName,
      agreeHonor,
      setAgreeHonor,
      agreeTerms,
      setAgreeTerms,
      earned,
      result,
      locked,
      lockedReason,
      cooldownMs,
      startTimer,
      finishTest,
      beginRetest,
      awardAndShowCertificate,
      persistPath,
      isTimerLive:
        Boolean(timerEndsAt) &&
        existing?.status !== "passed" &&
        existing?.status !== "failed",
    }),
    [
      agreeHonor,
      agreeTerms,
      answers,
      awardAndShowCertificate,
      beginRetest,
      certification,
      codeLanguages,
      codeDrafts,
      completedQuestionIds,
      confirmedName,
      cooldownMs,
      earned,
      existing?.status,
      finishTest,
      locked,
      lockedReason,
      markQuestionComplete,
      persistPath,
      profileName,
      ready,
      remaining,
      result,
      setAgreeHonor,
      setAgreeTerms,
      setAnswer,
      setConfirmedName,
      setQuestionLanguage,
      startTimer,
      timerEndsAt,
    ]
  );

  return (
    <CertSessionContext.Provider value={value}>
      {children}
    </CertSessionContext.Provider>
  );
}

export function useCertSession() {
  const ctx = useContext(CertSessionContext);
  if (!ctx) {
    throw new Error("useCertSession must be used within CertSessionProvider");
  }
  return ctx;
}
