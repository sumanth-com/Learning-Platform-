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

export default async function DashboardPage() {
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
    <>
      <PortalChrome fillViewport />
      <div className="h-full min-h-0 px-4 py-4 sm:px-6 lg:px-8">
        <DashboardHome
          displayName={data.user.name}
          continueState={data.continueState}
          journey={data.journey}
          assignments={assignments}
        />
      </div>
    </>
  );
}
