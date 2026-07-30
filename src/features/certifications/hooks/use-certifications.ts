"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AssessmentAttempt,
  CertProgressState,
  EarnedCertificate,
} from "@/features/certifications/types";
import { issueCertificateAction } from "@/features/certifications/actions/certificate-actions";
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
    const local = readState();
    setState(local);
    setReady(true);

    // Publish legacy browser-only credentials and replace them with the
    // canonical server-issued records used by QR verification.
    if (local.certificates.length > 0) {
      void Promise.all(
        local.certificates.map((certificate) =>
          issueCertificateAction({
            certificationId: certificate.certificationId,
            recipientName: certificate.recipientName,
            score: certificate.score,
          })
        )
      ).then((results) => {
        const issued = results.flatMap((result) =>
          result.success ? [result.certificate] : []
        );
        if (issued.length === 0) return;
        const current = readState();
        const byCertification = new Map(
          issued.map((certificate) => [
            certificate.certificationId,
            certificate,
          ])
        );
        const certificates = current.certificates.map(
          (certificate) =>
            byCertification.get(certificate.certificationId) ?? certificate
        );
        const next = { ...current, certificates };
        writeState(next);
        setState(next);
      });
    }
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
      const attempt = current.attempts[cert.certificationId];
      if (
        attempt?.status !== "passed" ||
        attempt.score == null ||
        attempt.score !== cert.score
      ) {
        return false;
      }
      const existing = current.certificates.find(
        (c) => c.certificationId === cert.certificationId
      );
      if (existing?.id === cert.id) return true;
      const certificates = existing
        ? current.certificates.map((currentCert) =>
            currentCert.certificationId === cert.certificationId
              ? cert
              : currentCert
          )
        : [cert, ...current.certificates];
      persist({
        ...current,
        certificates,
        xp: existing ? current.xp : current.xp + xpGain,
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
      return true;
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
      state.attempts[certificationId]?.status === "passed",
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

/** Replace a legacy local credential with its canonical server-issued record. */
export function cacheIssuedCertificate(certificate: EarnedCertificate) {
  if (typeof window === "undefined") return;
  const current = readState();
  const existing = current.certificates.find(
    (item) => item.certificationId === certificate.certificationId
  );
  const certificates = existing
    ? current.certificates.map((item) =>
        item.certificationId === certificate.certificationId
          ? certificate
          : item
      )
    : [certificate, ...current.certificates];
  writeState({ ...current, certificates });
}

export function listPublicCertificates(): EarnedCertificate[] {
  if (typeof window === "undefined") return [];
  try {
    return readState().certificates ?? [];
  } catch {
    return [];
  }
}
