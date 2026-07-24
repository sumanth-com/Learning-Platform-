import type { AssessmentQuestion, Certification } from "../types";

/** Professional URL segments for the certification assessment flow. */
export const CERT_FLOW = {
  root: (certId: string) => `/certifications/${certId}`,
  brief: (certId: string) => `/certifications/${certId}/brief`,
  plan: (certId: string) => `/certifications/${certId}/plan`,
  confirm: (certId: string) => `/certifications/${certId}/confirm`,
  honor: (certId: string) => `/certifications/${certId}/honor`,
  ready: (certId: string) => `/certifications/${certId}/ready`,
  lobby: (certId: string) => `/certifications/${certId}/lobby`,
  problem: (certId: string, slug: string) =>
    `/certifications/${certId}/problems/${slug}`,
  results: (certId: string) => `/certifications/${certId}/results`,
  certificate: (certId: string) => `/certifications/${certId}/certificate`,
} as const;

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function questionSlug(q: AssessmentQuestion) {
  if (q.title?.trim()) return slugifyTitle(q.title);
  return slugifyTitle(q.id);
}

export function findQuestionBySlug(
  certification: Certification,
  slug: string
): { question: AssessmentQuestion; index: number } | null {
  const idx = certification.questions.findIndex(
    (q) => questionSlug(q) === slug
  );
  if (idx < 0) return null;
  return { question: certification.questions[idx]!, index: idx };
}
