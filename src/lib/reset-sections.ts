import type { CurriculumWeekDefinition } from "@/curriculum/types";
import { collectTrackableEntities } from "@/curriculum/entities";
import { getCurriculumWeeks } from "@/curriculum/registry";
import { getProfessionalAiSkill } from "@/curriculum/ai-skills-professional";
import {
  COMMUNICATION_WEEKS,
  collectCommunicationIds,
} from "@/curriculum/communication-skills";
import { getWeekProjectIds } from "@/lib/progress-storage";

export type ResetSectionId =
  | "roadmap"
  | "ai-skills"
  | "communication"
  | "interview"
  | "projects"
  | "github"
  | "notes"
  | "study-stats";

export type ResetScope = number | "all";

export interface ResetSectionMeta {
  id: ResetSectionId;
  label: string;
  description: string;
  supportsWeekScope: boolean;
  variant: "default" | "danger";
}

export const RESET_SECTIONS: ResetSectionMeta[] = [
  {
    id: "roadmap",
    label: "Reset Roadmap",
    description: "Lessons, day topics, and programming challenges.",
    supportsWeekScope: true,
    variant: "default",
  },
  {
    id: "ai-skills",
    label: "Reset AI Skills",
    description: "AI learning topics, exercises, and prompts.",
    supportsWeekScope: true,
    variant: "default",
  },
  {
    id: "communication",
    label: "Reset Communication",
    description: "Communication programme lessons and practice.",
    supportsWeekScope: true,
    variant: "default",
  },
  {
    id: "interview",
    label: "Reset Interview",
    description: "Interview question completions and notes.",
    supportsWeekScope: true,
    variant: "default",
  },
  {
    id: "projects",
    label: "Reset Projects",
    description: "Project progress, status, and feature completions.",
    supportsWeekScope: true,
    variant: "default",
  },
  {
    id: "notes",
    label: "Reset Notes",
    description: "All saved notes in the Notes app.",
    supportsWeekScope: false,
    variant: "default",
  },
];

const ROADMAP_TYPES = new Set(["learning-lesson", "day-item", "programming-question"]);
const AI_TYPES = new Set(["ai-topic", "ai-exercise", "ai-prompt"]);
const INTERVIEW_TYPES = new Set(["interview-question"]);
const PROJECT_TYPES = new Set(["project-feature", "project-complete"]);
const GITHUB_TYPES = new Set(["github-file"]);

function weeksInScope(scope: ResetScope): CurriculumWeekDefinition[] {
  const weeks = getCurriculumWeeks();
  if (scope === "all") return weeks;
  const week = weeks.find((w) => w.id === scope);
  return week ? [week] : [];
}

function idsForTypes(weeks: CurriculumWeekDefinition[], types: Set<string>): string[] {
  return weeks
    .flatMap(collectTrackableEntities)
    .filter((e) => types.has(e.type))
    .map((e) => e.id);
}

export function getResetEntityIds(section: ResetSectionId, scope: ResetScope): Set<string> {
  const ids = new Set<string>();

  if (section === "communication") {
    const weeks =
      scope === "all"
        ? COMMUNICATION_WEEKS
        : COMMUNICATION_WEEKS.filter((w) => w.weekId === scope);
    weeks.forEach((w) => collectCommunicationIds(w.skill).forEach((id) => ids.add(id)));
    return ids;
  }

  const weeks = weeksInScope(scope);

  if (section === "roadmap") {
    idsForTypes(weeks, ROADMAP_TYPES).forEach((id) => ids.add(id));
    return ids;
  }

  if (section === "ai-skills") {
    idsForTypes(weeks, AI_TYPES).forEach((id) => ids.add(id));
    if (scope === "all" || scope === 12) {
      const pro = getProfessionalAiSkill();
      pro.learningTopics.forEach((t) => ids.add(t.id));
      pro.exercises.forEach((e) => ids.add(e.id));
      (pro.promptExercises ?? []).forEach((p) => ids.add(p.id));
    }
    return ids;
  }

  if (section === "interview") {
    idsForTypes(weeks, INTERVIEW_TYPES).forEach((id) => ids.add(id));
    return ids;
  }

  if (section === "projects") {
    idsForTypes(weeks, PROJECT_TYPES).forEach((id) => ids.add(id));
    return ids;
  }

  if (section === "github") {
    idsForTypes(weeks, GITHUB_TYPES).forEach((id) => ids.add(id));
    return ids;
  }

  return ids;
}

export function getResetProjectIds(section: ResetSectionId, scope: ResetScope): string[] {
  if (section !== "projects") return [];
  const weeks = weeksInScope(scope);
  return weeks.flatMap(getWeekProjectIds);
}

export function getResetGitHubWeekIds(section: ResetSectionId, scope: ResetScope): number[] {
  if (section !== "github") return [];
  if (scope === "all") return getCurriculumWeeks().map((w) => w.id);
  return [scope];
}

export function resetScopeLabel(scope: ResetScope): string {
  return scope === "all" ? "all weeks" : `Week ${scope}`;
}
