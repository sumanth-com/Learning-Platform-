import type { LearnDifficulty } from "@/learning-engine/types";

export type ThinkingChallengeKind =
  | "scenario"
  | "problem-analysis"
  | "input-output"
  | "requirement-analysis"
  | "pseudocode"
  | "flowchart"
  | "arrange-steps"
  | "multiple-choice"
  | "reflection";

export type ThinkingMcqOption = {
  id: string;
  label: string;
  correct: boolean;
};

export type ThinkingChallengeData = {
  kind: ThinkingChallengeKind;
  title: string;
  difficulty: LearnDifficulty;
  estimatedMinutes: number;
  scenario: string;
  task: string;
  hints: string[];
  referenceSolution: string;
  takeaways: string[];
  options?: ThinkingMcqOption[];
  /** Correct order for arrange-steps challenges */
  arrangeSteps?: string[];
};

export const THINKING_KIND_LABELS: Record<ThinkingChallengeKind, string> = {
  scenario: "Scenario Based",
  "problem-analysis": "Problem Analysis",
  "input-output": "Input / Output Identification",
  "requirement-analysis": "Requirement Analysis",
  pseudocode: "Pseudocode Writing",
  flowchart: "Flowchart Thinking",
  "arrange-steps": "Arrange Steps",
  "multiple-choice": "Multiple Choice",
  reflection: "Reflection Questions",
};

const TOPIC_KIND_CYCLE: Record<string, ThinkingChallengeKind[]> = {
  "thinking-like-a-developer": [
    "scenario",
    "input-output",
    "requirement-analysis",
    "problem-analysis",
    "reflection",
    "problem-analysis",
    "scenario",
    "reflection",
    "reflection",
  ],
  "breaking-down-problems": [
    "problem-analysis",
    "arrange-steps",
    "problem-analysis",
    "problem-analysis",
    "arrange-steps",
    "requirement-analysis",
    "problem-analysis",
    "scenario",
    "reflection",
  ],
  "understanding-requirements": [
    "requirement-analysis",
    "requirement-analysis",
    "problem-analysis",
    "requirement-analysis",
    "requirement-analysis",
    "requirement-analysis",
    "requirement-analysis",
    "scenario",
    "scenario",
  ],
  "pseudocode-and-flowcharts": [
    "pseudocode",
    "flowchart",
    "input-output",
    "pseudocode",
    "pseudocode",
    "pseudocode",
    "flowchart",
    "pseudocode",
    "pseudocode",
  ],
  "variables-and-state": [
    "input-output",
    "reflection",
    "problem-analysis",
    "input-output",
    "pseudocode",
    "requirement-analysis",
    "pseudocode",
    "reflection",
    "problem-analysis",
  ],
  "logic-and-decisions": [
    "multiple-choice",
    "pseudocode",
    "input-output",
    "pseudocode",
    "pseudocode",
    "reflection",
    "pseudocode",
    "problem-analysis",
    "flowchart",
  ],
  "patterns-and-debugging": [
    "pseudocode",
    "pseudocode",
    "pseudocode",
    "pseudocode",
    "problem-analysis",
    "reflection",
  ],
};

export function inferThinkingKind(
  topicSlug: string,
  index: number
): ThinkingChallengeKind {
  const cycle = TOPIC_KIND_CYCLE[topicSlug];
  if (!cycle?.length) return "scenario";
  return cycle[index % cycle.length]!;
}

export function defaultReferenceSolution(task: string, kind: ThinkingChallengeKind): string {
  const lead =
    kind === "pseudocode"
      ? "A solid answer looks like clear numbered steps (not real code yet):"
      : kind === "flowchart"
        ? "A solid answer shows Start → decisions → outcomes:"
        : kind === "reflection"
          ? "A strong reflection is honest, specific, and connects to how you'd work next time:"
          : "A solid answer covers the task clearly. Example direction:";
  return `${lead}\n\n${task}\n\nExpand each point with concrete detail a teammate could act on.`;
}

export function defaultTakeaways(kind: ThinkingChallengeKind): string[] {
  switch (kind) {
    case "scenario":
      return [
        "Restate the situation before jumping to tools.",
        "Name success and failure paths explicitly.",
        "Ask what the user experiences, not only what the system does.",
      ];
    case "problem-analysis":
      return [
        "Break big work into smaller, ordered pieces.",
        "Identify what blocks what before you start.",
        "The smallest useful step beats a perfect plan.",
      ];
    case "input-output":
      return [
        "Inputs are data going in; outputs are results coming out.",
        "Labeling I/O early prevents half-built features.",
        "Edge inputs (empty, invalid, huge) belong in the same list.",
      ];
    case "requirement-analysis":
      return [
        "Vague words like “fast” and “secure” must become measurable.",
        "Acceptance criteria make “done” testable.",
        "Assumptions you don’t write down will surprise you later.",
      ];
    case "pseudocode":
      return [
        "Pseudocode is planning in plain language.",
        "Name your variables and decisions before syntax.",
        "If you can’t write the steps, you’re not ready to code.",
      ];
    case "flowchart":
      return [
        "Flowcharts make branches and loops visible.",
        "Every decision needs at least two clear outcomes.",
        "Trace one example through the chart before coding.",
      ];
    case "arrange-steps":
      return [
        "Order matters — some steps unlock others.",
        "Design and clarify before implement and deploy.",
        "Reordering a bad sequence is cheaper than rewriting code.",
      ];
    case "multiple-choice":
      return [
        "Eliminate options that ignore constraints.",
        "Prefer the answer that matches the stated goal.",
        "Explain why wrong options fail — that builds judgment.",
      ];
    case "reflection":
      return [
        "Reflection turns practice into skill.",
        "Name what confused you and what you’d try next.",
        "Teaching a concept in simple words proves you understand it.",
      ];
  }
}
