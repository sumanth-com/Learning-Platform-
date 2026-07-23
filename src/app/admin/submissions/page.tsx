import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { Button } from "@/components/ui/button";
import { SubmissionStatusBadge } from "@/components/assignments/submission-status-badge";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { JourneySubmissionService } from "@/features/assignments/services/journey-submission.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const filter = typeof sp.filter === "string" ? sp.filter : "all";

  const items = await new JourneySubmissionService(ctx.supabase).listForAdmin({
    q,
    status: filter,
  });

  return (
    <div>
      <AdminPageHeader
        title="Assignment Submissions"
        description="Review student submissions from the Assignments journey."
      />
      <Suspense fallback={null}>
        <AdminToolbar
          placeholder="Search by student, email, or assignment…"
          filterKey="filter"
          filters={[
            { value: "all", label: "All" },
            { value: "submitted", label: "Submitted" },
            { value: "under_review", label: "Under review" },
            { value: "revision_requested", label: "Revision" },
            { value: "approved", label: "Approved" },
          ]}
        />
      </Suspense>
      <AdminTable
        rows={items}
        rowKey={(r) => r.id}
        emptyMessage="No journey submissions yet. When students click Submit for review, they appear here."
        columns={[
          {
            key: "student",
            header: "Student",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">
                  {r.student_name || "Unnamed"}
                </p>
                <p className="text-xs text-zinc-500">{r.student_email}</p>
              </div>
            ),
          },
          {
            key: "assignment",
            header: "Assignment",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">
                  A{r.assignment_number}: {r.assignment_title}
                </p>
                <p className="text-xs text-zinc-500">{r.module_title}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <SubmissionStatusBadge status={r.status} />,
          },
          {
            key: "submitted",
            header: "Submitted",
            render: (r) => (
              <span className="text-zinc-400">
                {r.submitted_at
                  ? new Date(r.submitted_at).toLocaleString()
                  : "—"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <Button asChild size="sm" variant="ghost">
                <Link href={ADMIN_ROUTES.submissionDetail(r.id)}>Review</Link>
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
