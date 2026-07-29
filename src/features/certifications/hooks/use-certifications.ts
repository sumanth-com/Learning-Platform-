"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AssessmentAttempt,
  CertProgressState,
  EarnedCertificate,
} from "@/features/certifications/types";
import { notifyCertificateEarned } from "@/lib/notifications";
import { createCertificateId as buildCertificateId } from "@/features/certifications/lib/certificate-id";
import type { CertificateIdInput } from "@/features/certifications/lib/certificate-id";

const STORAGE_KEY = "SupraBase.certifications.v1";
const LEGACY_STORAGE_KEYS = ["supralearn.certifications.v1"];

const EMPTY: CertProgressState = {
  attempts: {},
  certificates: [],
  xp: 0,
  badges: [],
};

function readState(): CertProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      LEGACY_STORAGE_KEYS.map((k) => window.localStorage.getItem(k)).find(
        Boolean
      ) ??
      null;
    if (!raw) return EMPTY;
    const parsed = { ...EMPTY, ...JSON.parse(raw) } as CertProgressState;
    // Migrate legacy key once
    if (!window.localStorage.getItem(STORAGE_KEY) && raw) {
      window.localStorage.setItem(STORAGE_KEY, raw);
    }
    return parsed;
  } catch {
    return EMPTY;
  }
}

function writeState(state: CertProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useCertifications() {
  const [state, setState] = useState<CertProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  const persist = useCallback((next: CertProgressState) => {
    setState(next);
    writeState(next);
  }, []);

  const saveAttempt = useCallback(
    (attempt: AssessmentAttempt) => {
      const current = readState();
      persist({
        ...current,
        attempts: { ...current.attempts, [attempt.certificationId]: attempt },
      });
    },
    [persist]
  );

  const awardCertificate = useCallback(
    (cert: EarnedCertificate, xpGain: number, badge: string) => {
      const current = readState();
      const exists = current.certificates.some((c) => c.id === cert.id);
      if (exists) return;
      persist({
        ...current,
        certificates: [cert, ...current.certificates],
        xp: current.xp + xpGain,
        badges: current.badges.includes(badge)
          ? current.badges
          : [...current.badges, badge],
      });
      notifyCertificateEarned({
        certificateId: cert.id,
        certificationId: cert.certificationId,
        title: cert.title,
        recipientName: cert.recipientName,
        score: cert.score,
      });
    },
    [persist]
  );

  const clearAttempt = useCallback(
    (certificationId: string) => {
      const current = readState();
      const { [certificationId]: _removed, ...rest } = current.attempts;
      persist({
        ...current,
        attempts: rest,
      });
    },
    [persist]
  );

  const isPassed = useCallback(
    (certificationId: string) =>
      state.attempts[certificationId]?.status === "passed" ||
      state.certificates.some((c) => c.certificationId === certificationId),
    [state]
  );

  const getAttempt = useCallback(
    (id: string) => state.attempts[id],
    [state.attempts]
  );

  return {
    ready,
    state,
    saveAttempt,
    awardCertificate,
    clearAttempt,
    isPassed,
    getAttempt,
  };
}

export function createCertificateId(
  input?: Partial<CertificateIdInput> & { recipientName?: string; certificationId?: string }
) {
  const current =
    typeof window !== "undefined" ? readState().certificates.map((c) => c.id) : [];
  return buildCertificateId({
    recipientName: input?.recipientName?.trim() || "Learner",
    certificationId: input?.certificationId || "general-basic",
    userId: input?.userId,
    issuedAt: input?.issuedAt,
    takenIds: [...current, ...(input?.takenIds ?? [])],
  });
}

/** Public lookup for verify page (localStorage on same browser; demo store). */
export function findCertificateById(id: string): EarnedCertificate | null {
  if (typeof window === "undefined") return null;
  try {
    return readState().certificates.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

export function listPublicCertificates(): EarnedCertificate[] {
  if (typeof window === "undefined") return [];
  try {
    return readState().certificates ?? [];
  } catch {
    return [];
  }
}
