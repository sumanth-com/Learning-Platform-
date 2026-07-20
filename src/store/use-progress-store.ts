"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserProfile, AppNote, StudySession, ProjectStatus } from "@/types";
import type { UserProgressState, ResumePosition } from "./progress-types";
import { defaultProgressState, PROGRESS_VERSION } from "./progress-types";
import { getCurriculumWeeks, getTotalWeeks } from "@/curriculum/registry";
import {
  getResetEntityIds,
  getResetGitHubWeekIds,
  getResetProjectIds,
  type ResetScope,
  type ResetSectionId,
} from "@/lib/reset-sections";
import {
  downloadJson,
  getWeekEntityIds,
  getWeekProjectIds,
  parseImportedProgress,
} from "@/lib/progress-storage";
import {
  computeWeekProgress,
  computeGlobalStats,
  getCurrentWeekId,
  isWeekLocked,
  isWeekCompleted,
  type ProgressCounts,
} from "@/lib/progress-engine";
import {
  getModuleCurrentWeek,
  getModuleWeekProgress,
  isModuleWeekCompleted,
  isModuleWeekLocked,
  markWeekCompleteAllModules,
  migrateProgressStateV3,
  rebuildModuleGatesFromProgress,
  type LearningModule,
} from "@/lib/module-progress";
import { COMMUNICATION_WEEKS } from "@/curriculum/communication-skills";
import { createIdbPersistStorage } from "@/lib/idb-persist-storage";
import { publishLiveActivity } from "@/lib/live-activity-sync";
import { EXPORT_APP_ID } from "@/lib/client-persistence";
import { ensurePrathyuBootstrap } from "@/lib/week-bootstrap";
const defaultProfile: UserProfile = {
  name: "Prathyu",
  avatar: "P",
  currentWeek: 1,
  streak: 0,
  totalStudyHours: 0,
  lastActiveDate: new Date().toISOString().split("T")[0],
  resumeReadinessScore: 0,
  githubProgress: 0,
};

const defaultNotes: AppNote[] = [];

function syncModuleUnlocks(progress: UserProgressState): UserProgressState {
  const weeks = getCurriculumWeeks();
  return migrateProgressStateV3(progress, weeks, { rebuildGates: true });
}

interface ProgressStore {
  progress: UserProgressState;
  profile: UserProfile;
  studySessions: StudySession[];
  notes: AppNote[];
  todayGoal: string;
  todayGoalDate: string;
  todayGoalCompleted: boolean;
  resumePosition: ResumePosition | null;

  getCompletionDate: (entityId: string) => string | undefined;
  getStats: () => ReturnType<typeof computeGlobalStats>;
  getWeekProgress: (weekId: number) => ReturnType<typeof computeWeekProgress>;
  getModuleWeekProgress: (module: LearningModule, weekId: number) => ProgressCounts;
  getCurrentWeekId: () => number;
  getModuleCurrentWeek: (module: LearningModule) => number;
  isLocked: (weekId: number) => boolean;
  isModuleWeekLocked: (module: LearningModule, weekId: number) => boolean;
  isCompleted: (weekId: number) => boolean;
  isModuleWeekCompleted: (module: LearningModule, weekId: number) => boolean;
  isDone: (entityId: string) => boolean;
  getNote: (entityId: string) => string;
  isBookmarked: (entityId: string) => boolean;

  // Universal toggle
  toggleComplete: (entityId: string) => void;
  setComplete: (entityId: string, value: boolean) => void;
  setNote: (entityId: string, note: string) => void;
  toggleBookmark: (entityId: string) => void;

  // Project-specific
  updateProjectMeta: (
    projectId: string,
    updates: Partial<{ progress: number; status: ProjectStatus; githubLink: string; notes: string }>
  ) => void;
  setProjectComplete: (projectId: string, complete: boolean) => void;

  // GitHub repo links
  setGitHubRepoLink: (weekId: number, link: string) => void;
  getGitHubRepoLink: (weekId: number) => string;

  // Week
  updateWeekNotes: (weekId: number, notes: string) => void;
  completeWeek: (weekId: number) => void;
  completeModuleWeek: (module: LearningModule, weekId: number) => void;
  setResumePosition: (position: ResumePosition) => void;
  setScrollPosition: (key: string, scrollY: number) => void;
  getScrollPosition: (key: string) => number;

  // Profile & misc
  setTodayGoal: (goal: string) => void;
  toggleTodayGoal: () => void;
  addStudySession: (hours: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addNote: (note: AppNote) => void;
  updateNote: (id: string, updates: Partial<AppNote>) => void;
  deleteNote: (id: string) => void;
  updateStreak: () => void;
  syncProfileFromProgress: () => void;
  bootstrapSession: () => void;
  resetWeekProgress: (weekId: number) => void;
  resetSectionProgress: (section: ResetSectionId, scope: ResetScope) => void;
  resetAllProgress: () => void;
  exportProgress: () => void;
  importProgress: (json: string) => void;
}

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function stripEntityKeys<T extends Record<string, unknown>>(map: T, ids: Set<string>): T {
  const next = { ...map };
  ids.forEach((id) => {
    delete next[id];
  });
  return next;
}

function syncDerivedProfile(
  profile: UserProfile,
  stats: ReturnType<typeof computeGlobalStats>,
  currentWeek: number
): UserProfile {
  return {
    ...profile,
    currentWeek,
    resumeReadinessScore: Math.min(
      Math.round(stats.overallProgress * 0.6 + stats.interviewCompleted * 2),
      100
    ),
    githubProgress: stats.githubTotal
      ? Math.round((stats.githubCompleted / stats.githubTotal) * 100)
      : 0,
  };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: defaultProgressState,
      profile: defaultProfile,
      studySessions: [],
      notes: defaultNotes,
      todayGoal: "Complete today's learning plan items",
      todayGoalDate: todayIso(),
      todayGoalCompleted: false,
      resumePosition: null,

      getStats: () => computeGlobalStats(getCurriculumWeeks(), get().progress),

      getWeekProgress: (weekId) => {
        const week = getCurriculumWeeks().find((w) => w.id === weekId);
        if (!week) {
          const empty = { completed: 0, total: 0, percentage: 0 };
          return {
            overall: empty,
            dayItems: empty,
            topicItems: empty,
            programming: empty,
            projects: empty,
            ai: empty,
            github: empty,
            interview: empty,
          };
        }
        return computeWeekProgress(week, get().progress);
      },

      getModuleWeekProgress: (module, weekId) => {
        const week = getCurriculumWeeks().find((w) => w.id === weekId);
        return getModuleWeekProgress(module, weekId, week, get().progress);
      },

      getCurrentWeekId: () => getCurrentWeekId(getCurriculumWeeks(), get().progress),

      getModuleCurrentWeek: (module) => {
        const max =
          module === "communication" ? COMMUNICATION_WEEKS.length : getTotalWeeks();
        return getModuleCurrentWeek(module, get().progress, max);
      },

      isLocked: (weekId) => isModuleWeekLocked("practice", weekId, get().progress),

      isModuleWeekLocked: (module, weekId) =>
        isModuleWeekLocked(module, weekId, get().progress),

      isCompleted: (weekId) => isModuleWeekCompleted("practice", weekId, get().progress),

      isModuleWeekCompleted: (module, weekId) =>
        isModuleWeekCompleted(module, weekId, get().progress),

      isDone: (entityId) => Boolean(get().progress.completed[entityId]),

      getNote: (entityId) => get().progress.notes[entityId] ?? "",

      isBookmarked: (entityId) => Boolean(get().progress.bookmarks[entityId]),

      getCompletionDate: (entityId) => get().progress.completionDates[entityId],

      toggleComplete: (entityId) => {
        set((state) => {
          const wasDone = state.progress.completed[entityId];
          const nowDone = !wasDone;
          const completed = { ...state.progress.completed, [entityId]: nowDone };
          const completionDates = { ...state.progress.completionDates };
          if (nowDone) {
            completionDates[entityId] = todayIso();
          } else {
            delete completionDates[entityId];
          }
          const progress = syncModuleUnlocks({ ...state.progress, completed, completionDates });
          const stats = computeGlobalStats(getCurriculumWeeks(), progress);
          const currentWeek = getCurrentWeekId(getCurriculumWeeks(), progress);
          return {
            progress,
            profile: syncDerivedProfile(state.profile, stats, currentWeek),
          };
        });
        get().updateStreak();
      },

      setComplete: (entityId, value) => {
        const current = get().isDone(entityId);
        if (current !== value) get().toggleComplete(entityId);
      },

      setNote: (entityId, note) =>
        set((state) => ({
          progress: {
            ...state.progress,
            notes: { ...state.progress.notes, [entityId]: note },
          },
        })),

      toggleBookmark: (entityId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            bookmarks: {
              ...state.progress.bookmarks,
              [entityId]: !state.progress.bookmarks[entityId],
            },
          },
        })),

      updateProjectMeta: (projectId, updates) =>
        set((state) => {
          const existing = state.progress.projectMeta[projectId] ?? {
            progress: 0,
            status: "not-started" as ProjectStatus,
            githubLink: "",
            notes: "",
          };
          const merged = { ...existing, ...updates };
          if (updates.progress !== undefined) {
            merged.status =
              updates.progress >= 100
                ? "completed"
                : updates.progress > 0
                  ? "in-progress"
                  : "not-started";
          }
          return {
            progress: {
              ...state.progress,
              projectMeta: { ...state.progress.projectMeta, [projectId]: merged },
            },
          };
        }),

      setProjectComplete: (projectId, complete) => {
        get().setComplete(`${projectId}-complete`, complete);
        get().updateProjectMeta(projectId, {
          progress: complete ? 100 : get().progress.projectMeta[projectId]?.progress ?? 0,
          status: complete ? "completed" : "in-progress",
        });
      },

      setGitHubRepoLink: (weekId, link) =>
        set((state) => ({
          progress: {
            ...state.progress,
            githubRepoLinks: { ...state.progress.githubRepoLinks, [weekId]: link },
          },
        })),

      getGitHubRepoLink: (weekId) => get().progress.githubRepoLinks[weekId] ?? "",

      updateWeekNotes: (weekId, notes) =>
        set((state) => ({
          progress: {
            ...state.progress,
            weekNotes: { ...state.progress.weekNotes, [weekId]: notes },
          },
        })),

      completeWeek: (weekId) => get().completeModuleWeek("practice", weekId),

      completeModuleWeek: (_module, _weekId) =>
        set((state) => {
          const progress = syncModuleUnlocks(state.progress);
          const stats = computeGlobalStats(getCurriculumWeeks(), progress);
          const currentWeek = getModuleCurrentWeek("practice", progress, getTotalWeeks());
          return {
            progress,
            profile: syncDerivedProfile(state.profile, stats, currentWeek),
          };
        }),

      setResumePosition: (position) =>
        set((state) => {
          publishLiveActivity({ ...position, learnerName: state.profile.name });
          return { resumePosition: position };
        }),

      setScrollPosition: (key, scrollY) =>
        set((state) => {
          if (state.progress.scrollPositions[key] === scrollY) return state;
          return {
            progress: {
              ...state.progress,
              scrollPositions: { ...state.progress.scrollPositions, [key]: scrollY },
            },
          };
        }),

      getScrollPosition: (key) => get().progress.scrollPositions[key] ?? 0,

      setTodayGoal: (goal) => set({ todayGoal: goal }),
      toggleTodayGoal: () => set((s) => ({ todayGoalCompleted: !s.todayGoalCompleted })),

      bootstrapSession: () => {
        const today = todayIso();
        set((state) => {
          const updates: Partial<typeof state> = {};
          if (state.todayGoalDate !== today) {
            updates.todayGoalDate = today;
            updates.todayGoalCompleted = false;
          }
          const weeks = getCurriculumWeeks();
          const progress = syncModuleUnlocks(
            ensurePrathyuBootstrap(
              migrateProgressStateV3(state.progress, weeks, { rebuildGates: true })
            )
          );
          updates.progress = progress;

          const practiceWeek = getModuleCurrentWeek("practice", progress, getTotalWeeks());
          const resume = state.resumePosition;
          if (resume && resume.weekId < practiceWeek) {
            updates.resumePosition = null;
          } else if (resume) {
            publishLiveActivity({
              ...resume,
              learnerName: state.profile.name,
            });
          }

          const stats = computeGlobalStats(weeks, progress);
          const currentWeek = getCurrentWeekId(weeks, progress);
          updates.profile = syncDerivedProfile(state.profile, stats, currentWeek);
          return { ...state, ...updates };
        });
        get().updateStreak();
      },

      resetWeekProgress: (weekId) => {
        const week = getCurriculumWeeks().find((w) => w.id === weekId);
        if (!week) return;
        const ids = new Set(getWeekEntityIds(week));
        const projectIds = getWeekProjectIds(week);

        set((state) => {
          const base = {
            ...state.progress,
            completed: stripEntityKeys(state.progress.completed, ids),
            notes: stripEntityKeys(state.progress.notes, ids),
            bookmarks: stripEntityKeys(state.progress.bookmarks, ids),
            completionDates: stripEntityKeys(state.progress.completionDates, ids),
            projectMeta: Object.fromEntries(
              Object.entries(state.progress.projectMeta).filter(([id]) => !projectIds.includes(id))
            ),
            githubRepoLinks: Object.fromEntries(
              Object.entries(state.progress.githubRepoLinks).filter(([id]) => Number(id) !== weekId)
            ),
            weekNotes: Object.fromEntries(
              Object.entries(state.progress.weekNotes).filter(([id]) => Number(id) !== weekId)
            ),
          };
          const progress = syncModuleUnlocks(base);
          const stats = computeGlobalStats(getCurriculumWeeks(), progress);
          const currentWeek = getCurrentWeekId(getCurriculumWeeks(), progress);
          return { progress, profile: syncDerivedProfile(state.profile, stats, currentWeek) };
        });
      },

      resetSectionProgress: (section, scope) => {
        if (section === "notes") {
          set({ notes: defaultNotes });
          return;
        }

        if (section === "study-stats") {
          set((state) => ({
            studySessions: [],
            profile: {
              ...state.profile,
              streak: 0,
              totalStudyHours: 0,
              lastActiveDate: todayIso(),
            },
          }));
          return;
        }

        const ids = getResetEntityIds(section, scope);
        const projectIds = getResetProjectIds(section, scope);
        const githubWeekIds = getResetGitHubWeekIds(section, scope);

        set((state) => {
          const base = {
            ...state.progress,
            completed: stripEntityKeys(state.progress.completed, ids),
            notes: stripEntityKeys(state.progress.notes, ids),
            bookmarks: stripEntityKeys(state.progress.bookmarks, ids),
            completionDates: stripEntityKeys(state.progress.completionDates, ids),
            projectMeta:
              projectIds.length > 0
                ? Object.fromEntries(
                    Object.entries(state.progress.projectMeta).filter(
                      ([id]) => !projectIds.includes(id)
                    )
                  )
                : state.progress.projectMeta,
            githubRepoLinks:
              githubWeekIds.length > 0
                ? Object.fromEntries(
                    Object.entries(state.progress.githubRepoLinks).filter(
                      ([id]) => !githubWeekIds.includes(Number(id))
                    )
                  )
                : state.progress.githubRepoLinks,
          };
          const progress = syncModuleUnlocks(base);
          const stats = computeGlobalStats(getCurriculumWeeks(), progress);
          const currentWeek = getCurrentWeekId(getCurriculumWeeks(), progress);
          return { progress, profile: syncDerivedProfile(state.profile, stats, currentWeek) };
        });
      },

      resetAllProgress: () => {
        set({
          progress: defaultProgressState,
          profile: { ...defaultProfile, lastActiveDate: todayIso() },
          studySessions: [],
          notes: defaultNotes,
          todayGoal: "Complete today's learning plan items",
          todayGoalDate: todayIso(),
          todayGoalCompleted: false,
          resumePosition: null,
        });
      },

      exportProgress: () => {
        const state = get();
        const payload = {
          version: PROGRESS_VERSION,
          exportedAt: new Date().toISOString(),
          app: EXPORT_APP_ID,
          progress: state.progress,
          profile: state.profile,
          studySessions: state.studySessions,
          notes: state.notes,
          todayGoal: state.todayGoal,
          todayGoalDate: state.todayGoalDate,
          todayGoalCompleted: state.todayGoalCompleted,
          resumePosition: state.resumePosition,
        };
        downloadJson(`supracodez-progress-${todayIso()}.json`, JSON.stringify(payload, null, 2));
      },

      importProgress: (json) => {
        const data = parseImportedProgress(json);
        const weeks = getCurriculumWeeks();
        const mergedProgress = migrateProgressStateV3(
          {
            ...defaultProgressState,
            ...(data.progress as UserProgressState),
            scrollPositions: {
              ...defaultProgressState.scrollPositions,
              ...((data.progress as UserProgressState)?.scrollPositions ?? {}),
            },
          },
          weeks,
          { rebuildGates: true }
        );
        const progress = syncModuleUnlocks(mergedProgress);

        set({
          progress,
          profile: syncDerivedProfile(
            { ...defaultProfile, ...(data.profile as UserProfile) },
            computeGlobalStats(weeks, progress),
            getCurrentWeekId(weeks, progress)
          ),
          studySessions: (data.studySessions as StudySession[]) ?? [],
          notes: (data.notes as AppNote[]) ?? defaultNotes,
          todayGoal: data.todayGoal ?? "Complete today's learning plan items",
          todayGoalDate: data.todayGoalDate ?? todayIso(),
          todayGoalCompleted: Boolean(data.todayGoalCompleted),
          resumePosition: (data.resumePosition as ResumePosition | null) ?? null,
        });

        const resume = (data.resumePosition as ResumePosition | null) ?? null;
        if (resume) {
          publishLiveActivity({
            ...resume,
            learnerName: get().profile.name,
          });
        }
      },

      addStudySession: (hours) =>
        set((state) => {
          const today = todayIso();
          const weekId = getCurrentWeekId(getCurriculumWeeks(), state.progress);
          const existing = state.studySessions.find((s) => s.date === today);
          const sessions = existing
            ? state.studySessions.map((s) =>
                s.date === today ? { ...s, hours: s.hours + hours } : s
              )
            : [...state.studySessions, { date: today, hours, weekId }];
          return {
            studySessions: sessions,
            profile: { ...state.profile, totalStudyHours: state.profile.totalStudyHours + hours },
          };
        }),

      updateProfile: (updates) => set((s) => ({ profile: { ...s.profile, ...updates } })),

      addNote: (note) => set((s) => ({ notes: [...s.notes, note] })),
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      updateStreak: () =>
        set((state) => {
          const today = todayIso();
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          const { lastActiveDate, streak } = state.profile;
          if (lastActiveDate === today) return state;
          const newStreak = lastActiveDate === yesterday ? streak + 1 : 1;
          return { profile: { ...state.profile, streak: newStreak, lastActiveDate: today } };
        }),

      syncProfileFromProgress: () =>
        set((state) => {
          const stats = computeGlobalStats(getCurriculumWeeks(), state.progress);
          const currentWeek = getCurrentWeekId(getCurriculumWeeks(), state.progress);
          return { profile: syncDerivedProfile(state.profile, stats, currentWeek) };
        }),
    }),
    {
      name: "prathyu-academy-v3",
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => createIdbPersistStorage()),
      migrate: (persisted, version) => {
        if (!persisted || typeof persisted !== "object") return persisted;
        const state = persisted as Record<string, unknown>;
        if (!state.todayGoalDate) state.todayGoalDate = todayIso();
        if (state.progress) {
          const weeks = getCurriculumWeeks();
          let progress = state.progress as UserProgressState;
          if (!progress.scrollPositions) {
            progress = { ...progress, scrollPositions: {} };
          }
          if (version < 18) {
            progress = markWeekCompleteAllModules(progress, 2, weeks);
          }
          if (version < PROGRESS_VERSION) {
            progress = {
              ...progress,
              version: PROGRESS_VERSION,
              moduleGates: rebuildModuleGatesFromProgress(weeks, progress),
              scrollPositions: progress.scrollPositions ?? {},
            };
          }
          state.progress = migrateProgressStateV3(progress, weeks, { rebuildGates: true });
        }
        if (version < PROGRESS_VERSION && !state.resumePosition) {
          state.resumePosition = null;
        }
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        state?.bootstrapSession();
      },
    }
  )
);

/** Backward-compatible alias */
export const useAppStore = useProgressStore;

export function getStats() {
  return useProgressStore.getState().getStats();
}
