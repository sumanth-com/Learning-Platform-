import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";

export const metadata = {
  title: "Assignments",
};

type AssignmentListRow = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  estimated_time: string | null;
  total_marks: number | null;
  due_days: number | null;
  lessons: { title: string; slug: string } | null;
};

export default async function AssignmentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select(
      "id, title, description, difficulty, estimated_time, total_marks, due_days, lessons(title, slug)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const assignments = (data ?? []) as unknown as AssignmentListRow[];

  return (
    <>
      <PortalChrome
        title="Assignments"
        subtitle="Practice what you learn with structured deliverables."
      />
      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-zinc-600" />
          <h2 className="mt-4 text-lg font-semibold text-zinc-100">
            No published assignments yet
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Assignments appear here as mentors publish them to lessons.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href={CURRICULUM_ROUTES.journey}>
              Browse journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((item) => (
            <li key={item.id}>
              <Link
                href={`/assignment/${item.id}`}
                className="flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-zinc-50">
                    {item.title}
                  </h2>
                  <Badge variant="secondary" className="shrink-0 capitalize">
                    {item.difficulty}
                  </Badge>
                </div>
                {item.description ? (
                  <p className="line-clamp-3 text-sm text-zinc-400">
                    {item.description}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-zinc-500">
                  <span className="truncate">
                    {item.lessons?.title ?? "Lesson assignment"}
                  </span>
                  <span className="shrink-0">
                    {item.estimated_time ??
                      (item.due_days != null
                        ? `${item.due_days}d`
                        : item.total_marks != null
                          ? `${item.total_marks} pts`
                          : "Open")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
