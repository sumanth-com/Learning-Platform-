import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminStudentsService } from "@/features/admin/services/students.service";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { ASSIGNMENT_ROUTES } from "@/features/assignments/types";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const service = new AdminStudentsService(ctx.supabase);
  const student = await service.getById(id);
  if (!student || student.role !== "student") notFound();

  const [summary, progress, submissions] = await Promise.all([
    service.getSummary(id),
    service.getProgress(id),
    service.getSubmissions(id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Button asChild size="sm" variant="ghost" className="mb-3 -ml-2">
          <Link href={ADMIN_ROUTES.students}>← Students</Link>
        </Button>
        <AdminPageHeader
          title={student.full_name || "Student"}
          description={student.email}
        />
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["Completed lessons", summary.completedLessons],
            ["Progress rows", summary.totalProgressRows],
            ["Submissions", summary.submissions],
            ["Approved", summary.approvedSubmissions],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 font-display text-2xl text-zinc-50">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg text-zinc-100">Progress</h2>
        <AdminTable
          rows={progress}
          rowKey={(r) => r.id}
          emptyMessage="No lesson progress yet."
          columns={[
            {
              key: "lesson",
              header: "Lesson",
              render: (r) => r.lessons?.title ?? "Lesson",
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Badge variant={r.completed ? "success" : "secondary"}>
                  {r.completed ? "Completed" : "In progress"}
                </Badge>
              ),
            },
            {
              key: "when",
              header: "Completed at",
              render: (r) =>
                r.completed_at
                  ? new Date(r.completed_at).toLocaleString()
                  : "—",
            },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-zinc-100">
          Submissions
        </h2>
        <AdminTable
          rows={submissions}
          rowKey={(r) => r.id}
          emptyMessage="No submissions yet."
          columns={[
            {
              key: "assignment",
              header: "Assignment",
              render: (r) => r.assignments?.title ?? "Assignment",
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <Badge variant="secondary" className="capitalize">
                  {r.status.replaceAll("_", " ")}
                </Badge>
              ),
            },
            {
              key: "marks",
              header: "Marks",
              render: (r) => r.marks ?? "—",
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (r) => (
                <Button asChild size="sm" variant="ghost">
                  <Link href={ASSIGNMENT_ROUTES.detail(r.assignment_id)}>
                    Open
                  </Link>
                </Button>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
