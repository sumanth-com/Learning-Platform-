import Link from "next/link";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  Layers,
  Users,
  Inbox,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { AdminStatsService } from "@/features/admin/services/stats.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

export default async function AdminDashboardPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const stats = await new AdminStatsService(ctx.supabase).getStats();

  const cards = [
    { label: "Total Courses", value: stats.courses, href: ADMIN_ROUTES.courses, icon: BookOpen },
    { label: "Total Phases", value: stats.phases, href: ADMIN_ROUTES.phases, icon: Layers },
    { label: "Total Modules", value: stats.modules, href: ADMIN_ROUTES.modules, icon: Boxes },
    { label: "Total Lessons", value: stats.lessons, href: ADMIN_ROUTES.lessons, icon: FileText },
    { label: "Total Assignments", value: stats.assignments, href: ADMIN_ROUTES.assignments, icon: ClipboardList },
    { label: "Total Students", value: stats.students, href: ADMIN_ROUTES.students, icon: Users },
    { label: "Assignment Submissions", value: stats.submissions, href: ADMIN_ROUTES.students, icon: Inbox },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Manage curriculum, assignments, resources, and students from the Admin Portal."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={ADMIN_ROUTES.analytics}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
        >
          Open Analytics
        </Link>
        <Link
          href={ADMIN_ROUTES.settings}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
        >
          Open Settings
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-zinc-500">{card.label}</p>
                <Icon className="h-4 w-4 text-zinc-600" />
              </div>
              <p className="font-display text-3xl text-zinc-50">{card.value}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
