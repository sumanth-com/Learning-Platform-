import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminAssignmentsService } from "@/features/admin/services/assignments.service";
import {
  deleteAdminAssignmentAction,
  toggleAssignmentPublishAction,
} from "@/features/admin/actions/assignment-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminAssignmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const filter = typeof sp.filter === "string" ? sp.filter : undefined;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const result = await new AdminAssignmentsService(ctx.supabase).list({
    q,
    filter,
    page,
  });

  return (
    <div>
      <AdminPageHeader
        title="Assignments"
        description="CRUD, publish, difficulty, marks, and due days."
        actionHref={ADMIN_ROUTES.assignmentNew}
        actionLabel="New assignment"
      />
      <Suspense fallback={null}>
        <AdminToolbar
          placeholder="Search assignments…"
          filters={[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "title",
            header: "Assignment",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">{r.title}</p>
                <p className="text-xs text-zinc-500">
                  {r.lessons?.title ?? "—"}
                </p>
              </div>
            ),
          },
          {
            key: "meta",
            header: "Details",
            render: (r) => (
              <span className="text-zinc-400">
                {r.total_marks} marks · {r.due_days}d · {r.difficulty}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <Badge variant={r.is_published ? "default" : "secondary"}>
                {r.is_published ? "Published" : "Draft"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-2">
                <PublishToggle
                  id={r.id}
                  isPublished={r.is_published}
                  action={toggleAssignmentPublishAction}
                />
                <Button asChild size="sm" variant="ghost">
                  <Link href={ADMIN_ROUTES.assignmentEdit(r.id)}>Edit</Link>
                </Button>
                <DeleteButton id={r.id} action={deleteAdminAssignmentAction} />
              </div>
            ),
          },
        ]}
      />
      <Suspense fallback={null}>
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
        />
      </Suspense>
    </div>
  );
}
