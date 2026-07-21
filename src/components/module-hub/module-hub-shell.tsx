"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  ClipboardList,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Map,
  Target,
} from "lucide-react";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CURRICULUM_ROUTES } from "@/features/curriculum/types";
import {
  useModuleHub,
} from "@/features/curriculum/hooks/use-module-hub";
import type { ModuleHubPayload } from "@/features/curriculum/actions/module-hub-actions";
import {
  formatModuleDuration,
  moduleDifficulty,
} from "@/features/curriculum/lib/module-hub";
import { DifficultyBadge } from "@/components/curriculum/difficulty-badge";

const NAV = [
  { id: "overview", label: "Overview", href: "", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", href: "/roadmap", icon: Map },
  { id: "practice", label: "Practice", href: "/practice", icon: Target },
  { id: "resources", label: "Resources", href: "/resources", icon: BookOpen },
  {
    id: "assignments",
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
  },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
  {
    id: "assessment",
    label: "Assessment",
    href: "/assessment",
    icon: GraduationCap,
  },
  { id: "ai-mentor", label: "AI Mentor", href: "/ai-mentor", icon: Bot },
] as const;

type ModuleHubShellProps = {
  moduleSlug: string;
  initialData: ModuleHubPayload;
  children: React.ReactNode;
};

export function ModuleHubShell({
  moduleSlug,
  initialData,
  children,
}: ModuleHubShellProps) {
  const pathname = usePathname();
  const hub = useModuleHub(moduleSlug, initialData);
  const detail = hub.data?.detail ?? initialData.detail;
  const base = CURRICULUM_ROUTES.module(moduleSlug);
  const onTopic = pathname.includes("/topic/");

  return (
    <>
      <PortalChrome fillViewport />
      <div className="flex h-full min-h-0 flex-col">
        <header className="shrink-0 border-b border-zinc-800/80 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-500">
                <Link
                  href={CURRICULUM_ROUTES.journey}
                  className="transition hover:text-zinc-300"
                >
                  Journey
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="truncate text-zinc-400">{detail.phase.title}</span>
              </div>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                {detail.module.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={moduleDifficulty(detail.lessons)} />
                <span className="rounded-full border border-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-500">
                  {formatModuleDuration(detail)}
                </span>
                <span className="rounded-full border border-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-500">
                  {detail.completedCount}/{detail.totalCount} topics
                </span>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-1.5">
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Module progress</span>
                <span className="tabular-nums text-zinc-300">
                  {detail.progressPercent}%
                </span>
              </div>
              <Progress value={detail.progressPercent} className="h-1.5" />
            </div>
          </div>

          {!onTopic ? (
            <nav className="mt-4 flex gap-1 overflow-x-auto pb-0.5">
              {NAV.map((item) => {
                const href = `${base}${item.href}`;
                const active =
                  item.href === ""
                    ? pathname === base || pathname === `${base}/`
                    : pathname.startsWith(href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      active
                        ? "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {children}
        </div>
      </div>
    </>
  );
}
