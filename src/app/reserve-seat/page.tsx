import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/auth/auth-shell";
import { ReserveSeatForm } from "@/components/auth/reserve-seat-form";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Request Access",
};

export default function ReserveSeatPage() {
  return (
    <AuthShell
      title="Request access."
      description="Suprabase is invite-only. Share your details and our team will review your request."
      panelVariant="reserve"
      footer={
        <>
          Already have an account?{" "}
          <Link href={AUTH_ROUTES.login} className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <ReserveSeatForm />
    </AuthShell>
  );
}
