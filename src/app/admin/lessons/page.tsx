import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminLessonsService } from "@/features/admin/services/lessons.service";
import { deleteLessonAction } from "@/features/admin/actions/lesson-actions";
import { ADMIN_ROUTES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLessonsPage({
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

  const result = await new AdminLessonsService(ctx.supabase).list({
    q,
    filter,
    page,
  });

  return (
    <div>
      <AdminPageHeader
        title="Lessons"
        description="Rich content, video, objectives, difficulty, and preview."
        actionHref={ADMIN_ROUTES.lessonNew}
        actionLabel="New lesson"
      />
      <Suspense fallback={null}>
        <AdminToolbar
          placeholder="Search lessons…"
          filters={[
            { value: "all", label: "All" },
            { value: "preview", label: "Preview only" },
          ]}
        />
      </Suspense>
      <AdminTable
        rows={result.items}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "title",
            header: "Lesson",
            render: (r) => (
              <div>
                <p className="font-medium text-zinc-100">{r.title}</p>
                <p className="text-xs text-zinc-500">
                  {r.modules?.title ?? "—"} · {r.duration_minutes}m
                </p>
              </div>
            ),
          },
          {
            key: "difficulty",
            header: "Difficulty",
            render: (r) => (
              <span className="capitalize text-zinc-400">{r.difficulty}</span>
            ),
          },
          {
            key: "preview",
            header: "Preview",
            render: (r) =>
              r.is_preview ? (
                <Badge variant="success">Preview</Badge>
              ) : (
                <span className="text-zinc-600">—</span>
              ),
          },
          {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href={ADMIN_ROUTES.lessonEdit(r.id)}>Edit</Link>
                </Button>
                <DeleteButton id={r.id} action={deleteLessonAction} />
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
