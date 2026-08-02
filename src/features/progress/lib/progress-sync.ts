"use client";

import {
  addStudySessionAction,
  deleteLearnerNoteAction,
  getLearnerWorkspaceAction,
  setEntityCompleteAction,
  setEntityNoteAction,
  setResumePositionAction,
  syncModuleGatesAction,
  toggleBookmarkAction,
  updateLearnerPreferencesAction,
  upsertAssignmentMetaAction,
  upsertLearnerNoteAction,
  upsertProjectMetaAction,
  upsertWeekNoteAction,
} from "@/features/progress/actions/progress-actions";
import type { LearnerWorkspace } from "@/features/progress/lib/workspace-mapper";
import type { ResumePosition } from "@/lib/module-progress";
import type { AssignmentProgressMeta, ProjectProgressMeta } from "@/store/progress-types";
import type { AppNote } from "@/types";

/** Fire-and-forget server sync — UI stays optimistic; failures are logged. */
function sync(task: () => Promise<unknown>) {
  void task().catch((error) => {
    console.error("[progress-sync]", error);
  });
}

export async function fetchLearnerWorkspace(): Promise<LearnerWorkspace | null> {
  const result = await getLearnerWorkspaceAction();
  if (!result.success || !result.data) return null;
  return result.data.workspace;
}

export function syncEntityComplete(
  entityId: string,
  completed: boolean,
  xp = 10
) {
  sync(() =>
    setEntityCompleteAction({
      entityId,
      completed,
      xp: completed ? xp : 0,
      sourceKey: completed ? `entity:${entityId}` : undefined,
    })
  );
}

export function syncEntityNote(entityId: string, note: string) {
  sync(() => setEntityNoteAction(entityId, note));
}

export function syncBookmark(entityId: string, on: boolean) {
  sync(() => toggleBookmarkAction(entityId, on));
}

export function syncProjectMeta(
  projectId: string,
  updates: Partial<ProjectProgressMeta>
) {
  sync(() =>
    upsertProjectMetaAction({
      projectId,
      progress: updates.progress,
      status: updates.status,
      githubLink: updates.githubLink,
      notes: updates.notes,
    })
  );
}

export function syncAssignmentMeta(
  catalogId: string,
  updates: Partial<AssignmentProgressMeta>
) {
  sync(() =>
    upsertAssignmentMetaAction({
      catalogId,
      updates: {
        status: updates.status,
        github_url: updates.githubUrl,
        live_url: updates.liveUrl,
        screenshots: updates.screenshots,
        notes: updates.notes,
        reflection: updates.reflection,
        submitted_at: updates.submittedAt,
        reviewed_at: updates.reviewedAt,
        feedback: updates.feedback,
        marks: updates.marks,
      },
    })
  );
}

export function syncResume(position: ResumePosition) {
  sync(() =>
    setResumePositionAction({
      module: position.module,
      week_id: position.weekId,
      title: position.title,
      subtitle: position.subtitle ?? null,
      href: position.href,
      topic_slug: position.topicSlug ?? null,
      topic_title: position.topicTitle ?? null,
      lesson_id: position.lessonId ?? null,
    })
  );
}

export function syncWeekNote(weekId: number, note: string) {
  sync(() => upsertWeekNoteAction(weekId, note));
}

export function syncPreferences(patch: Record<string, unknown>) {
  sync(() => updateLearnerPreferencesAction(patch as never));
}

export function syncStudySession(hours: number, weekId: number) {
  sync(() => addStudySessionAction(hours, weekId));
}

export function syncAddNote(note: AppNote) {
  sync(() =>
    upsertLearnerNoteAction({
      id: note.id?.startsWith("local-") ? undefined : note.id,
      title: note.title,
      content: note.content,
      weekId: note.weekId ?? null,
      pinned: note.pinned,
      accent: note.accent ?? null,
    })
  );
}

export function syncUpdateNote(id: string, updates: Partial<AppNote>) {
  sync(() =>
    upsertLearnerNoteAction({
      id,
      title: updates.title,
      content: updates.content,
      weekId: updates.weekId,
      pinned: updates.pinned,
      accent: updates.accent,
    })
  );
}

export function syncDeleteNote(id: string) {
  sync(() => deleteLearnerNoteAction(id));
}

export function syncModuleGates(
  gates: Record<string, { unlockedWeekIds: number[]; completedWeekIds: number[] }>
) {
  sync(() => syncModuleGatesAction(gates));
}
