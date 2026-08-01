import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Activity,
  CalendarDays,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminStatsService } from "@/features/admin/services/stats.service";
import { ADMIN_ROUTES } from "@/features/admin/types";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const overview = await new AdminStatsService(ctx.supabase).getBusinessOverview();

  const cards = [
    {
      label: "Total Students",
      value: overview.totalStudents,
      href: ADMIN_ROUTES.students,
      icon: Users,
    },
    {
      label: "Active Students",
      value: overview.activeStudents,
      href: ADMIN_ROUTES.students,
      icon: UserCheck,
    },
    {
      label: "Pending Requests",
      value: overview.pendingRequests,
      href: ADMIN_ROUTES.accessRequests,
      icon: ClipboardList,
    },
    {
      label: "Approved This Week",
      value: overview.approvedThisWeek,
      href: ADMIN_ROUTES.accessRequests,
      icon: UserPlus,
    },
    {
      label: "Rejected Requests",
      value: overview.rejectedRequests,
      href: ADMIN_ROUTES.accessRequests,
      icon: UserMinus,
    },
    {
      label: "Certificates Issued",
      value: overview.certificatesIssued,
      href: ADMIN_ROUTES.certifications,
      icon: Award,
    },
    {
      label: "Weekly Active",
      value: overview.weeklyActiveUsers,
      href: ADMIN_ROUTES.analytics,
      icon: Activity,
    },
    {
      label: "Monthly Active",
      value: overview.monthlyActiveUsers,
      href: ADMIN_ROUTES.analytics,
      icon: CalendarDays,
    },
    {
      label: "Completion Rate",
      value: `${overview.completionRate}%`,
      href: ADMIN_ROUTES.analytics,
      icon: TrendingUp,
    },
    {
      label: "Revenue",
      value: "—",
      href: ADMIN_ROUTES.settings,
      icon: IndianRupee,
      hint: "Future ready",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Business overview for the Suprabase platform — students, access, learning, and growth."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={cn(
                "group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition",
                "hover:border-zinc-700 hover:bg-zinc-900/70"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-medium leading-snug text-zinc-500">
                  {card.label}
                </p>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-950/50 text-zinc-500 transition group-hover:border-zinc-700 group-hover:text-zinc-300">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-zinc-50">
                  {card.value}
                </p>
                {"hint" in card && card.hint ? (
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    {card.hint}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-100">
                Recent Signups
              </h2>
              <p className="mt-1 text-xs text-zinc-500">Newest student accounts</p>
            </div>
            <Link
              href={ADMIN_ROUTES.students}
              className="text-xs font-medium text-[#a7423d] transition hover:text-[#c45a54]"
            >
              View all
            </Link>
          </div>
          {overview.recentSignups.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No students yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {overview.recentSignups.map((s) => (
                <li key={s.id}>
                  <Link
                    href={ADMIN_ROUTES.studentDetail(s.id)}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-zinc-900/80"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-300">
                      {s.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (s.full_name || s.email).slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-200">
                        {s.full_name || "Unnamed"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{s.email}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-600">
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight text-zinc-100">
              Learning Progress
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Platform-wide lesson completion
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-zinc-500">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="text-xs font-medium">Completed lessons</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                {overview.learningProgress.completedLessons}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-zinc-500">
                <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="text-xs font-medium">Progress records</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                {overview.learningProgress.totalProgressRows}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-medium">Completion rate</span>
              <span className="font-medium text-zinc-300">
                {overview.completionRate}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#a7423d] transition-all"
                style={{ width: `${Math.min(100, overview.completionRate)}%` }}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: ADMIN_ROUTES.accessRequests, label: "Access requests" },
              { href: ADMIN_ROUTES.analytics, label: "Analytics" },
              { href: ADMIN_ROUTES.learning, label: "Learning" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
