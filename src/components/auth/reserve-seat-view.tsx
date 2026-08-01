"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ReserveSeatForm } from "@/components/auth/reserve-seat-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

/** Owns form + success chrome so the card title updates after submit. */
export function ReserveSeatView() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <AuthShell
      title={submitted ? "You're on the list." : "Request access."}
      description={
        submitted
          ? "We received your details. Here's what happens next."
          : "Suprabase is invite-only. Share your details and our team will review your request."
      }
      panelVariant="reserve"
      footer={
        submitted ? null : (
          <>
            Already have an account?{" "}
            <Link href={AUTH_ROUTES.login} className={authLinkClass}>
              Sign in
            </Link>
          </>
        )
      }
    >
      <ReserveSeatForm
        onSubmitted={() => setSubmitted(true)}
        submitted={submitted}
      />
    </AuthShell>
  );
}
