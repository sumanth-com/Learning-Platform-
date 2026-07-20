import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminStudentsService } from "@/features/admin/services/students.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const result = await new AdminStudentsService(ctx.supabase).list({ q, page });

  return (
    <div>
      <AdminPageHeader
        title="Students"
        description="Search students and review progress or submissions."
      />
      <Suspense fallback={null}>
        <AdminToolbar placeholder="Search by name or email…" />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "name",
            header: "Student",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">
                  {r.full_name || "Unnamed"}
                </p>
                <p className="text-xs text-zinc-500">{r.email}</p>
              </div>
            ),
          },
          {
            key: "joined",
            header: "Joined",
            render: (r) => (
              <span className="text-zinc-400">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <Button asChild size="sm" variant="ghost">
                <Link href={ADMIN_ROUTES.studentDetail(r.id)}>View</Link>
              </Button>
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
