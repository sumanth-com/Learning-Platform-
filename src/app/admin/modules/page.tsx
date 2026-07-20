import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminModulesService } from "@/features/admin/services/modules.service";
import { deleteModuleAction } from "@/features/admin/actions/module-actions";
import { ADMIN_ROUTES, MODULE_COLOR_OPTIONS } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminModulesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const result = await new AdminModulesService(ctx.supabase).list({ q, page });

  return (
    <div>
      <AdminPageHeader
        title="Modules"
        description="Assign modules to phases with icon, color, and duration."
        actionHref={ADMIN_ROUTES.moduleNew}
        actionLabel="New module"
      />
      <Suspense fallback={null}>
        <AdminToolbar placeholder="Search modules…" />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "title",
            header: "Module",
            render: (r) => {
              const color =
                MODULE_COLOR_OPTIONS.find((c) => c.value === r.color)?.hex ??
                "#6366f1";
              return (
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="font-medium text-zinc-100">{r.title}</p>
                    <p className="text-xs text-zinc-500">
                      {r.icon} · {r.estimated_duration || "No duration"}
                    </p>
                  </div>
                </div>
              );
            },
          },
          {
            key: "phase",
            header: "Phase",
            render: (r) => (
              <span className="text-zinc-400">{r.phases?.title ?? "—"}</span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href={ADMIN_ROUTES.moduleEdit(r.id)}>Edit</Link>
                </Button>
                <DeleteButton id={r.id} action={deleteModuleAction} />
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
