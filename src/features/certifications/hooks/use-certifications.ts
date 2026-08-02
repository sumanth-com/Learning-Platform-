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
import {
  getActiveWorkspaceUserId,
  scopedWorkspaceKey,
  subscribeWorkspaceChange,
  WORKSPACE_STORAGE_BASES,
} from "@/lib/client-workspace";

const EMPTY: CertProgressState = {
  attempts: {},
  certificates: [],
  xp: 0,
  badges: [],
};

function storageKey(): string | null {
  return scopedWorkspaceKey(
    WORKSPACE_STORAGE_BASES.certifications,
    getActiveWorkspaceUserId()
  );
}

function readState(): CertProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const key = storageKey();
    if (!key) return EMPTY;
    const raw = window.localStorage.getItem(key);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) } as CertProgressState;
  } catch {
    return EMPTY;
  }
}

function writeState(state: CertProgressState) {
  const key = storageKey();
  if (!key) return;
  window.localStorage.setItem(key, JSON.stringify(state));
}

export function useCertifications() {
  const [state, setState] = useState<CertProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      const local = readState();
      setState(local);
      setReady(Boolean(getActiveWorkspaceUserId()));

      void import("@/features/progress/actions/progress-actions").then(
        async ({ getCertAttemptsAction }) => {
          const result = await getCertAttemptsAction();
          if (!result.success || !result.data) return;
          const attempts: CertProgressState["attempts"] = {};
          for (const row of result.data.attempts as Array<{
            certification_id: string;
            payload: AssessmentAttempt;
            status: string;
            score: number | null;
          }>) {
            attempts[row.certification_id] = {
              ...(row.payload as AssessmentAttempt),
              certificationId: row.certification_id,
              status: row.status as AssessmentAttempt["status"],
              score: row.score ?? undefined,
            };
          }
          const next = { ...readState(), attempts };
          writeState(next);
          setState(next);
        }
      );

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
    };

    load();
    return subscribeWorkspaceChange(() => load());
  }, []);

  const persist = useCallback((next: CertProgressState) => {
    setState(next);
    writeState(next);
    // Persist each attempt durably
    Object.entries(next.attempts).forEach(([certificationId, attempt]) => {
      void import("@/features/progress/actions/progress-actions").then(
        ({ upsertCertAttemptAction }) =>
          upsertCertAttemptAction({
            certificationId,
            payload: attempt as unknown as Record<string, unknown>,
            status: attempt.status,
            score: attempt.score ?? null,
          })
      );
    });
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
  input?: Partial<CertificateIdInput> & {
    recipientName?: string;
    certificationId?: string;
  }
) {
  const current =
    typeof window !== "undefined"
      ? readState().certificates.map((c) => c.id)
      : [];
  return buildCertificateId({
    recipientName: input?.recipientName?.trim() || "Learner",
    certificationId: input?.certificationId || "general-basic",
    userId: input?.userId,
    issuedAt: input?.issuedAt,
    takenIds: [...current, ...(input?.takenIds ?? [])],
  });
}

/** Local cache lookup — server `verify_certificate` is the public source of truth. */
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
