/**
 * Professional credential IDs for SupraBase certificates.
 * Format: SB-{SKILL}-{YYYYMMDD}-{USER}{RAND}
 * Example: SB-JSB-20260728-A7F3K9M2
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function encodeBase(n: number, length: number): string {
  let x = n >>> 0;
  let out = "";
  for (let i = 0; i < length; i++) {
    out = ALPHABET[x % ALPHABET.length]! + out;
    x = Math.floor(x / ALPHABET.length);
  }
  return out;
}

function randomPart(length: number): string {
  let out = "";
  const bytes =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(length))
      : Array.from({ length }, () => Math.floor(Math.random() * 256));
  for (let i = 0; i < length; i++) {
    out += ALPHABET[(bytes[i] as number) % ALPHABET.length]!;
  }
  return out;
}

/** Compact skill code from certification id, e.g. javascript-basic → JSB */
export function certificateSkillCode(certificationId: string): string {
  const parts = certificationId.toLowerCase().split("-").filter(Boolean);
  if (parts.length === 0) return "GEN";
  const level = parts[parts.length - 1]!;
  const cat = parts.slice(0, -1).join("") || parts[0]!;
  const base = cat.slice(0, 2).toUpperCase().padEnd(2, "X");
  const suffix = level.startsWith("int") ? "I" : "B";
  return `${base}${suffix}`;
}

export type CertificateIdInput = {
  userId?: string;
  recipientName: string;
  certificationId: string;
  issuedAt?: Date | string;
  /** Optional existing IDs to avoid rare collisions */
  takenIds?: Iterable<string>;
};

/**
 * Build a unique credential ID scoped to the learner + certification.
 * Same person → different user fingerprint than another learner.
 */
export function createCertificateId(input: CertificateIdInput): string {
  const issued = input.issuedAt ? new Date(input.issuedAt) : new Date();
  const yyyy = issued.getUTCFullYear();
  const mm = String(issued.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(issued.getUTCDate()).padStart(2, "0");
  const date = `${yyyy}${mm}${dd}`;
  const skill = certificateSkillCode(input.certificationId);

  const identityKey = [
    input.userId?.trim() || "anon",
    input.recipientName.trim().toLowerCase(),
    input.certificationId,
  ].join("|");
  const userPart = encodeBase(hash32(identityKey), 4);

  const taken = new Set(input.takenIds ?? []);
  for (let attempt = 0; attempt < 12; attempt++) {
    const entropy = randomPart(4);
    const id = `SB-${skill}-${date}-${userPart}${entropy}`;
    if (!taken.has(id)) return id;
  }

  // Extremely unlikely fallback
  return `SB-${skill}-${date}-${userPart}${randomPart(6)}`;
}

/** Pretty label for UI / certificate footer */
export function formatCertificateIdLabel(id: string) {
  return id;
}
