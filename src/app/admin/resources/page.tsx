import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { ResourceDeleteButton } from "@/components/admin/resource-delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminResourcesService } from "@/features/admin/services/resources.service";
import { ADMIN_ROUTES, LESSON_RESOURCE_TYPES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const filter = typeof sp.filter === "string" ? sp.filter : undefined;
  const scope =
    typeof sp.scope === "string"
      ? (sp.scope as "lesson" | "assignment" | "all")
      : "all";
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const result = await new AdminResourcesService(ctx.supabase).list({
    q,
    filter,
    scope,
    page,
  });

  return (
    <div>
      <AdminPageHeader
        title="Resources"
        description="PDF, video, article, GitHub, docs, and external links."
        actionHref={ADMIN_ROUTES.resourceNew}
        actionLabel="New resource"
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["lesson", "Lesson"],
            ["assignment", "Assignment"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            asChild
            size="sm"
            variant={scope === value ? "default" : "outline"}
          >
            <Link href={`${ADMIN_ROUTES.resources}?scope=${value}`}>{label}</Link>
          </Button>
        ))}
      </div>
      <Suspense fallback={null}>
        <AdminToolbar
          placeholder="Search resources…"
          filters={[
            { value: "all", label: "All types" },
            ...LESSON_RESOURCE_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            })),
          ]}
        />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => `${r.scope}-${r.id}`}
        columns={[
          {
            key: "title",
            header: "Resource",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">{r.title}</p>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:underline"
                >
                  {r.url}
                </a>
              </div>
            ),
          },
          {
            key: "parent",
            header: "Attached to",
            render: (r) => (
              <div>
                <Badge variant="secondary" className="mb-1 capitalize">
                  {r.scope}
                </Badge>
                <p className="text-xs text-zinc-400">{r.parentTitle}</p>
              </div>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (r) => (
              <span className="uppercase text-zinc-400">{r.type}</span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link
                    href={`${ADMIN_ROUTES.resourceEdit(r.id)}?scope=${r.scope}`}
                  >
                    Edit
                  </Link>
                </Button>
                <ResourceDeleteButton id={r.id} scope={r.scope} />
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
