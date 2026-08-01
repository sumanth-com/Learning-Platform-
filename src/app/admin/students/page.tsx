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

function initials(name: string | null, email: string) {
  const base = (name || email).trim();
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

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
        description="Manage learner accounts, progress, and access across the platform."
      />
      <Suspense fallback={null}>
        <AdminToolbar placeholder="Search by name or email…" />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "photo",
            header: "Student",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-300">
                  {r.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.avatar_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(r.full_name, r.email)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">
                    {r.full_name || "Unnamed"}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{r.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "phone",
            header: "Phone",
            render: () => <span className="text-zinc-500">—</span>,
          },
          {
            key: "status",
            header: "Status",
            render: () => (
              <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                Active
              </span>
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
              <div className="flex justify-end gap-1">
                <Button asChild size="sm" variant="ghost">
                  <Link href={ADMIN_ROUTES.studentDetail(r.id)}>View</Link>
                </Button>
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
      <p className="mt-4 text-xs text-zinc-600">
        Suspend, reset password, deactivate, and delete actions will attach to
        each row as account controls expand.
      </p>
    </div>
  );
}
