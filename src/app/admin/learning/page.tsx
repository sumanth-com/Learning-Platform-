import Link from "next/link";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  FolderOpen,
  Layers,
  Video,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { ADMIN_ROUTES } from "@/features/admin/types";

const HUBS = [
  {
    title: "Courses",
    description: "Create, publish, and organize learning tracks.",
    href: ADMIN_ROUTES.courses,
    icon: BookOpen,
  },
  {
    title: "Weeks / Phases",
    description: "Structure curriculum into weeks and phases.",
    href: ADMIN_ROUTES.phases,
    icon: Layers,
  },
  {
    title: "Lessons",
    description: "Manage lesson content, drafts, and visibility.",
    href: ADMIN_ROUTES.lessons,
    icon: FileText,
  },
  {
    title: "Modules",
    description: "Group lessons into coherent modules.",
    href: ADMIN_ROUTES.modules,
    icon: Boxes,
  },
  {
    title: "Projects & Assignments",
    description: "Publish graded work and review submissions.",
    href: ADMIN_ROUTES.assignments,
    icon: ClipboardList,
  },
  {
    title: "Videos & Resources",
    description: "Attach PDFs, videos, docs, and external links.",
    href: ADMIN_ROUTES.resources,
    icon: FolderOpen,
  },
  {
    title: "Submissions",
    description: "Review student assignment submissions.",
    href: ADMIN_ROUTES.submissions,
    icon: Video,
  },
] as const;

export const metadata = {
  title: "Learning Management",
};

export default async function AdminLearningHubPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  return (
    <div>
      <AdminPageHeader
        title="Learning Management"
        description="Manage courses, weeks, lessons, projects, assignments, videos, and resources — draft or publish."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.href}
              href={hub.href}
              className="group rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/50 to-transparent p-5 transition hover:border-zinc-700 hover:from-zinc-900/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 transition group-hover:text-[#f3aaa0]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-medium text-zinc-100">{hub.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{hub.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
