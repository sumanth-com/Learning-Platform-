"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getAllProjectListings,
  listRoadmapModuleOptions,
  type ProjectDifficulty,
} from "@/curriculum/project-catalog";
import { ProjectCard } from "@/components/projects/project-card";
import {
  DifficultyTabs,
  FilterSelect,
} from "@/components/shared/filter-pills";
import { useProgressStore } from "@/store/use-progress-store";

type DifficultyFilter = "all" | ProjectDifficulty;

function parseDifficulty(value: string | null): DifficultyFilter {
  if (value === "easy" || value === "medium" || value === "hard") return value;
  return "all";
}

export function ProjectsGallery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projects = useMemo(() => getAllProjectListings(), []);
  const moduleOptions = useMemo(
    () => [
      { value: "all", label: "All modules" },
      ...listRoadmapModuleOptions().map((m) => ({
        value: m.slug,
        label: `M${m.id} · ${m.title}`,
      })),
    ],
    []
  );

  const moduleFilter = searchParams.get("module") ?? "all";
  const difficultyFilter = parseDifficulty(searchParams.get("level"));

  const setFilters = useCallback(
    (next: { module?: string; level?: DifficultyFilter }) => {
      const params = new URLSearchParams(searchParams.toString());
      const moduleValue = next.module ?? moduleFilter;
      const levelValue = next.level ?? difficultyFilter;

      if (!moduleValue || moduleValue === "all") params.delete("module");
      else params.set("module", moduleValue);

      if (!levelValue || levelValue === "all") params.delete("level");
      else params.set("level", levelValue);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, moduleFilter, difficultyFilter, pathname, router]
  );

  const completedMap = useProgressStore((s) => s.progress.completed);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (
        moduleFilter !== "all" &&
        project.moduleSlug !== moduleFilter &&
        String(project.moduleNumber) !== moduleFilter
      ) {
        return false;
      }
      if (
        difficultyFilter !== "all" &&
        project.difficulty !== difficultyFilter
      ) {
        return false;
      }
      return true;
    });
  }, [projects, moduleFilter, difficultyFilter]);

  const moduleLabel =
    moduleOptions.find((o) => o.value === moduleFilter)?.label ??
    (moduleFilter === "all" ? "All modules" : moduleFilter);

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Module
            </span>
            <FilterSelect
              compact
              label="Module"
              className="w-[14.5rem] sm:w-[16rem]"
              value={
                moduleOptions.some((o) => o.value === moduleFilter)
                  ? moduleFilter
                  : "all"
              }
              onChange={(value) => setFilters({ module: value })}
              options={moduleOptions}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Level
            </span>
            <DifficultyTabs
              className="w-[14.5rem] sm:w-[16rem]"
              options={[
                { id: "all", label: "All" },
                { id: "easy", label: "Easy" },
                { id: "medium", label: "Medium" },
                { id: "hard", label: "Hard" },
              ]}
              value={difficultyFilter}
              onChange={(level) => setFilters({ level })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {projects.length} projects
          {moduleFilter !== "all" ? ` · ${moduleLabel}` : " · All modules"}
          {difficultyFilter !== "all" ? ` · ${difficultyFilter}` : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No projects match</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another module or difficulty filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              locked={false}
              complete={Boolean(completedMap[`${project.id}-complete`])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
