import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AccessRequestsTable } from "@/components/admin/access-requests-table";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { ADMIN_ROUTES } from "@/features/admin/types";
import type { SeatRequestRow } from "@/types/database";

export const metadata = {
  title: "Access Requests",
};

export default async function AdminAccessRequestsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) {
    redirect(
      ctx.user
        ? ADMIN_ROUTES.forbidden
        : `/login?next=${ADMIN_ROUTES.accessRequests}`
    );
  }

  const { data, error } = await ctx.supabase
    .from("seat_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <AdminPageHeader
          title="Access Requests"
          description="Review and invite learners to Suprabase."
        />
        <p className="text-sm text-rose-300">{error.message}</p>
      </div>
    );
  }

  const pending =
    (data ?? []).filter((r) => (r as SeatRequestRow).status === "pending")
      .length;

  return (
    <div>
      <AdminPageHeader
        title="Access Requests"
        description={`${pending} pending · Approve to create the account, send the invite email, and track activity.`}
      />
      <AccessRequestsTable items={(data ?? []) as SeatRequestRow[]} />
    </div>
  );
}
