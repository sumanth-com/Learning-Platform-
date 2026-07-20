import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { PhaseSortableList } from "@/components/admin/phase-sortable-list";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminPhasesService } from "@/features/admin/services/phases.service";
import { AdminCoursesService } from "@/features/admin/services/courses.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPhasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const courseId = typeof sp.courseId === "string" ? sp.courseId : undefined;

  const [phasesResult, courses] = await Promise.all([
    new AdminPhasesService(ctx.supabase).list({
      q,
      courseId,
      pageSize: 100,
    }),
    new AdminCoursesService(ctx.supabase).listAll(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Phases"
        description="Drag to reorder phases within a course. Filter by course for clean sorting."
        actionHref={ADMIN_ROUTES.phaseNew}
        actionLabel="New phase"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          asChild
          size="sm"
          variant={!courseId ? "default" : "outline"}
        >
          <Link href={ADMIN_ROUTES.phases}>All courses</Link>
        </Button>
        {courses.map((c) => (
          <Button
            key={c.id}
            asChild
            size="sm"
            variant={courseId === c.id ? "default" : "outline"}
          >
            <Link href={`${ADMIN_ROUTES.phases}?courseId=${c.id}`}>
              {c.title}
            </Link>
          </Button>
        ))}
      </div>

      <Suspense fallback={null}>
        <AdminToolbar placeholder="Search phases…" />
      </Suspense>

      <PhaseSortableList
        disabled={!courseId}
        phases={phasesResult.items.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          sort_order: p.sort_order,
          courseTitle: p.courses?.title,
        }))}
      />
      {!courseId ? (
        <p className="mt-3 text-xs text-zinc-500">
          Select a course above to enable drag-and-drop reordering.
        </p>
      ) : null}
    </div>
  );
}
