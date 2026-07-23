"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  computeAssignmentStats,
  deriveAssignmentCardStatus,
  getAllAssignmentListings,
  listAssignmentModuleOptions,
  ROADMAP_MODULE_ASSIGNMENTS,
} from "@/curriculum/assignment-catalog";
import { AssignmentProgressStrip } from "@/components/assignments/journey/assignment-progress-strip";
import { AssignmentModuleSection } from "@/components/assignments/journey/assignment-module-section";
import { FilterSelect } from "@/components/shared/filter-pills";
import { useProgressStore } from "@/store/use-progress-store";

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const days = Array.from(
    new Set(
      dates
        .map((d) => d.slice(0, 10))
        .filter(Boolean)
        .sort()
        .reverse()
    )
  );
  if (days.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  let cursor = new Date(today);
  let streak = 0;
  for (const day of days) {
    const iso = cursor.toISOString().slice(0, 10);
    if (day === iso) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      if (day === cursor.toISOString().slice(0, 10)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
    }
    break;
  }
  return streak;
}

export function AssignmentsGallery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listings = useMemo(() => getAllAssignmentListings(), []);
  const moduleOptions = useMemo(
    () => [
      { value: "all", label: "All modules" },
      ...listAssignmentModuleOptions().map((m) => ({
        value: m.slug,
        label: `M${m.id} · ${m.displayTitle}`,
      })),
    ],
    []
  );

  const moduleFilter = searchParams.get("module") ?? "all";

  const completedMap = useProgressStore((s) => s.progress.completed);
  const completionDates = useProgressStore((s) => s.progress.completionDates);
  const assignmentMeta = useProgressStore((s) => s.progress.assignmentMeta);
  const profileStreak = useProgressStore((s) => s.profile.streak);

  const isComplete = useCallback(
    (id: string) => Boolean(completedMap[`${id}-complete`]),
    [completedMap]
  );

  const setModuleFilter = useCallback(
    (moduleValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!moduleValue || moduleValue === "all") params.delete("module");
      else params.set("module", moduleValue);
      params.delete("level");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const stats = useMemo(
    () => computeAssignmentStats(listings, isComplete),
    [listings, isComplete]
  );

  const streak = useMemo(() => {
    const assignmentDates = Object.entries(completionDates)
      .filter(([key]) => key.endsWith("-complete") && key.startsWith("a"))
      .map(([, value]) => value);
    return Math.max(profileStreak, computeStreak(assignmentDates));
  }, [completionDates, profileStreak]);

  const sections = useMemo(() => {
    return ROADMAP_MODULE_ASSIGNMENTS.map((mod) => {
      if (
        moduleFilter !== "all" &&
        mod.slug !== moduleFilter &&
        String(mod.moduleNumber) !== moduleFilter
      ) {
        return null;
      }

      const assignments = mod.assignments.map((a) => {
        const listing = listings.find((l) => l.id === a.id)!;
        const completed = isComplete(a.id);
        const meta = assignmentMeta?.[a.id];
        const status = deriveAssignmentCardStatus({
          locked: false,
          completed,
          submissionStatus: meta?.status,
        });
        return {
          assignment: listing,
          status,
          completionDate: completionDates[`${a.id}-complete`],
        };
      });

      return {
        moduleNumber: mod.moduleNumber,
        title: mod.displayTitle,
        unlocked: true,
        assignments,
      };
    }).filter(Boolean) as Array<{
      moduleNumber: number;
      title: string;
      unlocked: boolean;
      assignments: Array<{
        assignment: (typeof listings)[number];
        status: ReturnType<typeof deriveAssignmentCardStatus>;
        completionDate?: string;
      }>;
    }>;
  }, [listings, isComplete, moduleFilter, assignmentMeta, completionDates]);

  return (
    <div className="w-full min-w-0 space-y-5 pb-4">
      <AssignmentProgressStrip
        completed={stats.completed}
        remaining={stats.remaining}
        xpEarned={stats.xpEarned}
        streak={streak}
        completionPct={stats.completionPct}
      />

      <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-3 sm:p-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Module
            </span>
            <FilterSelect
              compact
              label="Module"
              className="w-full max-w-[16rem] sm:w-[16rem]"
              value={
                moduleOptions.some((o) => o.value === moduleFilter)
                  ? moduleFilter
                  : "all"
              }
              onChange={setModuleFilter}
              options={moduleOptions}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          4 assignments per module · filter by module
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No assignments match</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another module filter.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <AssignmentModuleSection
              key={section.moduleNumber}
              moduleNumber={section.moduleNumber}
              title={section.title}
              unlocked={section.unlocked}
              assignments={section.assignments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
