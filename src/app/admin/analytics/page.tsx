import {
  Activity,
  Award,
  ClipboardList,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminStatsService } from "@/features/admin/services/stats.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

export default async function AdminAnalyticsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const [stats, overview] = await Promise.all([
    new AdminStatsService(ctx.supabase).getStats(),
    new AdminStatsService(ctx.supabase).getBusinessOverview(),
  ]);

  const charts = [
    {
      label: "New Students",
      value: overview.totalStudents,
      hint: "Total registered learners",
      icon: UserPlus,
      href: ADMIN_ROUTES.students,
    },
    {
      label: "Access Requests",
      value: overview.pendingRequests,
      hint: "Currently pending review",
      icon: ClipboardList,
      href: ADMIN_ROUTES.accessRequests,
    },
    {
      label: "Daily / Weekly Active",
      value: overview.weeklyActiveUsers,
      hint: "Learners with progress in last 7 days",
      icon: Activity,
      href: ADMIN_ROUTES.students,
    },
    {
      label: "Completion Rate",
      value: `${overview.completionRate}%`,
      hint: "Completed vs started lessons",
      icon: TrendingUp,
      href: ADMIN_ROUTES.learning,
    },
    {
      label: "Certificates Earned",
      value: overview.certificatesIssued,
      hint: "Issued credentials",
      icon: Award,
      href: ADMIN_ROUTES.certifications,
    },
    {
      label: "Retention (MAU)",
      value: overview.monthlyActiveUsers,
      hint: "Active in last 30 days",
      icon: Users,
      href: ADMIN_ROUTES.students,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Analytics"
        description="Growth, retention, completion, and engagement across Suprabase."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {charts.map((chart) => {
          const Icon = chart.icon;
          return (
            <Link
              key={chart.label}
              href={chart.href}
              className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 transition hover:border-zinc-700"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-zinc-500">{chart.label}</p>
                <Icon className="h-4 w-4 text-zinc-600" />
              </div>
              <p className="font-display text-3xl text-zinc-50">{chart.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{chart.hint}</p>
              <div className="mt-4 h-16 rounded-lg bg-zinc-900/80 px-2 py-3">
                <div className="flex h-full items-end gap-1">
                  {[40, 55, 35, 70, 48, 82, 60, 75, 50, 90, 68, 78].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-[#e56b68]/40 to-[#f3aaa0]/70"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5">
        <h2 className="font-display text-lg text-zinc-100">
          Content inventory
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Curriculum depth supporting learning analytics.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Courses", stats.courses, ADMIN_ROUTES.courses],
            ["Phases", stats.phases, ADMIN_ROUTES.phases],
            ["Modules", stats.modules, ADMIN_ROUTES.modules],
            ["Lessons", stats.lessons, ADMIN_ROUTES.lessons],
            ["Assignments", stats.assignments, ADMIN_ROUTES.assignments],
          ].map(([label, value, href]) => (
            <Link
              key={String(label)}
              href={String(href)}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 transition hover:border-zinc-700"
            >
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 font-display text-2xl text-zinc-50">{value}</p>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs text-zinc-600">
          Popular modules, most-asked AI questions, and learning-time charts
          will surface here as event tracking expands — layout stays fixed.
        </p>
      </section>
    </div>
  );
}
