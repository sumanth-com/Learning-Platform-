"use client";

import Link from "next/link";
import { ArrowLeft, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRow } from "@/components/learn/progress-row";
import type { WorkspaceTree } from "@/features/learn/lib/workspace-tree";

type LearnHeaderProps = {
  tree: WorkspaceTree;
  phaseTitle?: string | null;
  moduleTitle?: string | null;
  lessonProgress?: number | null;
  onToggleDesktopSidebar: () => void;
  onOpenMobileDrawer: () => void;
  desktopSidebarOpen: boolean;
};

export function LearnHeader({
  tree,
  phaseTitle,
  moduleTitle,
  lessonProgress,
  onToggleDesktopSidebar,
  onOpenMobileDrawer,
  desktopSidebarOpen,
}: LearnHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 shrink-0 lg:hidden"
          onClick={onOpenMobileDrawer}
          aria-label="Open curriculum"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="hidden h-9 w-9 shrink-0 lg:inline-flex"
          onClick={onToggleDesktopSidebar}
          aria-label={
            desktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          {desktopSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 transition hover:text-zinc-300"
            >
              <ArrowLeft className="h-3 w-3" />
              Dashboard
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="truncate text-zinc-400">{tree.course.title}</span>
            {phaseTitle ? (
              <>
                <span className="hidden text-zinc-700 sm:inline">/</span>
                <span className="hidden truncate sm:inline">{phaseTitle}</span>
              </>
            ) : null}
            {moduleTitle ? (
              <>
                <span className="hidden text-zinc-700 md:inline">/</span>
                <span className="hidden truncate md:inline">{moduleTitle}</span>
              </>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-100">
            Learning workspace
          </p>
        </div>

        <div className="hidden w-44 shrink-0 sm:block">
          <ProgressRow
            label="Course"
            value={tree.progressPercent}
            meta={`${tree.progressPercent}%`}
          />
          {typeof lessonProgress === "number" ? (
            <p className="mt-1 text-[10px] text-zinc-600">
              Module lesson progress {lessonProgress}%
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
