export {
  buildWorkspaceTree,
  resolveInitialLessonSlug,
  applyLessonCompletion,
} from "@/features/learn/lib/workspace-tree";
export type {
  WorkspaceTree,
  WorkspaceLessonNode,
  WorkspaceLessonPayload,
  WorkspaceLessonStatus,
} from "@/features/learn/lib/workspace-tree";
export { resolveLessonObjectives } from "@/features/learn/lib/objectives";
export { loadWorkspaceLessonAction } from "@/features/learn/actions/workspace-actions";
