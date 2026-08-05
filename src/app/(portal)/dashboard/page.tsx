import { Suspense } from "react";
import { DashboardHome } from "@/components/portal/dashboard-home";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { getPortalData } from "@/features/portal/lib/get-portal-data";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard",
};

type AssignmentRow = {
  id: string;
  title: string;
  difficulty: string;
  due_days: number | null;
  lessons: { title: string } | null;
};

function DashboardFallback() {
  return (
    <div className="h-full min-h-0 animate-pulse space-y-4 px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="h-8 w-48 rounded bg-zinc-800/80" />
      <div className="h-28 rounded-xl bg-zinc-900/50" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-32 rounded-xl bg-zinc-900/40" />
        <div className="h-32 rounded-xl bg-zinc-900/40" />
        <div className="h-32 rounded-xl bg-zinc-900/40" />
      </div>
    </div>
  );
}

async function DashboardContent() {
  const data = await getPortalData();

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("assignments")
    .select("id, title, difficulty, due_days, lessons(title)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5);

  const assignments = ((rows ?? []) as unknown as AssignmentRow[]).map(
    (row) => ({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      dueDays: row.due_days,
      lessonTitle: row.lessons?.title ?? null,
    })
  );

  return (
    <div className="h-full min-h-0 px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8 max-md:pb-2">
      <DashboardHome
        displayName={data.user.name}
        continueState={data.continueState}
        journey={data.journey}
        assignments={assignments}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PortalChrome fillViewport />
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
