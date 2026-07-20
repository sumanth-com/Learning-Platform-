import {
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  Inbox,
  Layers,
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

  const stats = await new AdminStatsService(ctx.supabase).getStats();

  const rows = [
    {
      label: "Courses",
      value: stats.courses,
      href: ADMIN_ROUTES.courses,
      icon: BookOpen,
      hint: "Published and draft",
    },
    {
      label: "Phases",
      value: stats.phases,
      href: ADMIN_ROUTES.phases,
      icon: Layers,
      hint: "Across all courses",
    },
    {
      label: "Modules",
      value: stats.modules,
      href: ADMIN_ROUTES.modules,
      icon: Boxes,
      hint: "Curriculum modules",
    },
    {
      label: "Lessons",
      value: stats.lessons,
      href: ADMIN_ROUTES.lessons,
      icon: FileText,
      hint: "Learning units",
    },
    {
      label: "Assignments",
      value: stats.assignments,
      href: ADMIN_ROUTES.assignments,
      icon: ClipboardList,
      hint: "Published and draft",
    },
    {
      label: "Students",
      value: stats.students,
      href: ADMIN_ROUTES.students,
      icon: Users,
      hint: "Registered learners",
    },
    {
      label: "Submissions",
      value: stats.submissions,
      href: ADMIN_ROUTES.students,
      icon: Inbox,
      hint: "Assignment submissions",
    },
  ];

  const contentTotal =
    stats.courses + stats.phases + stats.modules + stats.lessons;
  const engagementRate =
    stats.students === 0
      ? 0
      : Math.min(100, Math.round((stats.submissions / stats.students) * 10));

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="High-level content and engagement snapshot for the learning platform."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-5">
          <p className="text-sm text-zinc-500">Content inventory</p>
          <p className="mt-2 font-display text-3xl text-zinc-50">
            {contentTotal}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Courses + phases + modules + lessons
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-5">
          <p className="text-sm text-zinc-500">Submission intensity</p>
          <p className="mt-2 font-display text-3xl text-zinc-50">
            {engagementRate}
            <span className="text-lg text-zinc-500"> / 100</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Relative submissions per student (scaled)
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60">
            <tr>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Metric
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Count
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
                Open
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <tr
                  key={row.label}
                  className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-medium text-zinc-100">{row.label}</p>
                        <p className="text-xs text-zinc-500">{row.hint}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display text-lg text-zinc-50">
                    {row.value}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={row.href}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
