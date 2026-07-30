"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCertCardMeta } from "@/features/certifications/data/catalog";
import { createCertificateId } from "@/features/certifications/lib/certificate-id";
import type { EarnedCertificate } from "@/features/certifications/types";
import type { CertificateRow } from "@/types/database";

type IssueCertificateResult =
  | { success: true; certificate: EarnedCertificate }
  | { success: false; error: string };

function toEarnedCertificate(row: CertificateRow): EarnedCertificate {
  return {
    id: row.id,
    certificationId: row.certification_id,
    recipientName: row.recipient_name,
    issuedAt: row.issued_at,
    score: row.score,
    level: row.level,
    technology: row.technology,
    title: row.title,
    verifyPath: `/verify/${encodeURIComponent(row.id)}`,
  };
}

/**
 * Persists a globally unique credential. Catalog-controlled fields and the
 * profile identity are derived on the server and cannot be supplied by clients.
 */
export async function issueCertificateAction(input: {
  certificationId: string;
  recipientName: string;
  score: number;
}): Promise<IssueCertificateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in to issue a certificate" };

  const certification = getCertCardMeta(input.certificationId);
  if (!certification) {
    return { success: false, error: "Unknown certification" };
  }

  const score = Math.round(Number(input.score));
  if (
    !Number.isFinite(score) ||
    score < certification.passingScore ||
    score > 100
  ) {
    return {
      success: false,
      error: `A score of at least ${certification.passingScore}% is required`,
    };
  }

  const requestedName = input.recipientName.replace(/\s+/g, " ").trim();
  const fallbackName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "") ||
    user.email?.split("@")[0] ||
    "Learner";
  const recipientName =
    requestedName.length >= 2 && requestedName.length <= 100
      ? requestedName
      : fallbackName.slice(0, 100);

  try {
    const admin = createAdminClient();
    const { data: existing, error: existingError } = await admin
      .from("certificates")
      .select("*")
      .eq("profile_id", user.id)
      .eq("certification_id", certification.id)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) {
      return {
        success: true,
        certificate: toEarnedCertificate(existing as CertificateRow),
      };
    }

    // The primary key is the final collision guard. Retry with fresh entropy in
    // the exceptionally unlikely event that two credentials generate one ID.
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const issuedAt = new Date().toISOString();
      const id = createCertificateId({
        userId: user.id,
        recipientName,
        certificationId: certification.id,
        issuedAt,
      });
      const { data, error } = await admin
        .from("certificates")
        .insert({
          id,
          profile_id: user.id,
          certification_id: certification.id,
          recipient_name: recipientName,
          title: certification.title,
          technology: certification.categoryLabel,
          level: certification.level,
          score,
          issued_at: issuedAt,
        })
        .select("*")
        .single();

      if (!error && data) {
        return {
          success: true,
          certificate: toEarnedCertificate(data as CertificateRow),
        };
      }
      if (error?.code !== "23505") throw error;
    }

    return {
      success: false,
      error: "Could not allocate a unique credential ID. Please try again.",
    };
  } catch (error) {
    console.error("Certificate issuance failed", error);
    return {
      success: false,
      error: "Certificate could not be issued right now",
    };
  }
}
