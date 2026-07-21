import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import { flattenToolingTopics } from "@/features/curriculum/lib/developer-tooling-curriculum";
import type { ThinkingChallengeData } from "@/features/curriculum/lib/thinking-challenge";

export type ToolingChallengeKind =
  | "terminal"
  | "git"
  | "scenario"
  | "debug"
  | "recovery";

export type ToolingChallenge = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ToolingChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  referenceSolution: string;
  takeaways: string[];
  /** Commands the learner should demonstrate in the terminal (substring match) */
  validateIncludes: string[];
  lesson: LearnLesson;
  experience: "tooling";
  source: "synthetic";
  weekId: number;
};

function buildLesson(
  topicSlug: string,
  id: string,
  title: string,
  difficulty: LearnDifficulty,
  minutes: number,
  scenario: string,
  task: string,
  hints: string[]
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "git",
    description: task,
    problemStatement: `## Scenario\n\n${scenario}\n\n## Task\n\n${task}`,
    command: "git status",
    terminalOutput: "Use the academy terminal to complete this challenge.",
    workflowDiagram: "working → staging → local → remote",
    explanation: task,
    commonMistakes: hints,
    editorLanguage: "bash",
    estimatedMinutes: minutes,
    problemType: "terminal",
    hints,
  };
}

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ToolingChallengeKind;
  scenario: string;
  task: string;
  hints: string[];
  referenceSolution: string;
  takeaways: string[];
  validateIncludes: string[];
};

function scenarioForTopic(topicSlug: string, topicTitle: string): string {
  if (topicSlug === "what-is-terminal") {
    return [
      "A terminal is a text window where you type commands to control your computer.",
      "The shell (Bash, Zsh, PowerShell, or CMD) reads those commands and tells the operating system what to do.",
      "",
      "Developers use the terminal because it is fast, scriptable, and universal — servers, Git, CI, and deploy tools all speak command line.",
      "",
      "In SupraLearn you practice in a safe simulated terminal. Same commands you will use on the job, with zero risk to your real machine.",
      "",
      "Your goal in this warm-up: get comfortable looking around before you change anything.",
    ].join("\n");
  }

  if (topicSlug.startsWith("git") || topicSlug.includes("git") || topicSlug.includes("branch") || topicSlug.includes("commit") || topicSlug.includes("repo")) {
    return [
      `This challenge builds real skill for ${topicTitle}.`,
      "",
      "Git tracks snapshots of your project so you can experiment safely, collaborate, and recover from mistakes.",
      "You will use the academy terminal on the right — not a code editor.",
      "",
      "Read the instructions carefully, then prove the steps in the simulator.",
    ].join("\n");
  }

  if (topicSlug.includes("github") || topicSlug.includes("ssh") || topicSlug.includes("remote")) {
    return [
      `This challenge is about ${topicTitle} in a real developer workflow.`,
      "",
      "GitHub hosts remotes, pull requests, and team collaboration. The terminal is how you connect your local work to that remote world.",
      "Practice the commands here so you do not need to search docs mid-task later.",
    ].join("\n");
  }

  return [
    `You are learning ${topicTitle} inside the SupraLearn terminal academy.`,
    "",
    "The terminal is how professional developers navigate files, run tools, and control Git without leaving the keyboard.",
    "This simulator is safe — nothing on your real computer can break.",
    "",
    "Follow the instructions on the left, then run the matching commands on the right.",
  ].join("\n");
}

function specsForTopic(topicSlug: string, topicTitle: string): Spec[] {
  const topicScenario = scenarioForTopic(topicSlug, topicTitle);

  const base: Spec[] = [
    {
      key: "e1",
      title: `${topicTitle} — Easy warm-up`,
      difficulty: "easy",
      minutes: 8,
      kind: "terminal",
      scenario: topicScenario,
      task: "1) Run pwd to see where you are.\n2) Run ls to list files.\n3) Type help if you want the supported command list.",
      hints: [
        "Type pwd and press Enter — it prints your current folder.",
        "Then type ls to see notes.txt and projects.",
        "If a command fails, read the error line and try again.",
      ],
      referenceSolution:
        "pwd\nls\nhelp\n\nYou should see /home/student, then the file list.",
      takeaways: [
        "Always check where you are before changing files.",
        "pwd + ls is the orientation loop professionals use constantly.",
      ],
      validateIncludes: ["pwd"],
    },
    {
      key: "m1",
      title: `${topicTitle} — Medium workflow`,
      difficulty: "medium",
      minutes: 15,
      kind: "git",
      scenario: `A teammate asks you to demonstrate the core idea from ${topicTitle} using only the terminal.`,
      task: "1) Run git status (init the repo with git init first if needed).\n2) Make one meaningful change for this topic (file, branch, or commit).\n3) Run git status again to confirm the result.",
      hints: [
        "If you see fatal: not a git repository, run git init first.",
        "git status is your compass — use it before and after changes.",
        "Keep the change small so you can explain it clearly.",
      ],
      referenceSolution:
        `git init\ngit status\n(touch or edit a file if needed)\ngit add .\ngit commit -m "Practice ${topicTitle}"\ngit status`,
      takeaways: [
        "Status before action prevents most beginner mistakes.",
        "Small verified steps beat guessing long command chains.",
      ],
      validateIncludes: ["git"],
    },
    {
      key: "h1",
      title: `${topicTitle} — Hard scenario`,
      difficulty: "hard",
      minutes: 22,
      kind: "scenario",
      scenario: `You have limited time. Complete a clean sequence that proves you understand ${topicTitle}, then show evidence with git status or git log.`,
      task: "1) Plan 3 short steps on paper (or in your head).\n2) Execute them in the terminal.\n3) Finish with git status or git log so a reviewer could verify your work.",
      hints: [
        "Write the steps first — then type them.",
        "Prefer clear commit messages over vague ones like update.",
        "If something looks wrong, stop and run git status before the next command.",
      ],
      referenceSolution:
        "Plan → execute → prove\nExample finishers:\ngit status\ngit log",
      takeaways: [
        "Pros narrate and verify — they do not hope it worked.",
        "Evidence (status/log) is part of finishing the job.",
      ],
      validateIncludes: ["git status"],
    },
  ];

  if (topicSlug.includes("conflict") || topicSlug.includes("merge")) {
    base.push({
      key: "h2",
      title: "Merge calmly under pressure",
      difficulty: "hard",
      minutes: 25,
      kind: "debug",
      scenario:
        "Two branches contain related work. Your job is to combine them without panicking.",
      task: "1) Create two branches and commit on each.\n2) Switch back to main (or your base branch).\n3) Run git merge with the feature branch.\n4) Confirm with git status or git log.",
      hints: [
        "Commit on both branches before you merge.",
        "Use git branch to see branch names.",
        "After merge, git status should look clean if it succeeded.",
      ],
      referenceSolution:
        "git checkout -b feature-a\n(commit)\ngit checkout main\ngit checkout -b feature-b\n(commit)\ngit checkout main\ngit merge feature-a\ngit status",
      takeaways: [
        "Merges are normal team work, not emergencies.",
        "Always verify with status after combining history.",
      ],
      validateIncludes: ["git merge"],
    });
  }

  if (
    topicSlug.includes("recover") ||
    topicSlug.includes("reflog") ||
    topicSlug.includes("broken")
  ) {
    base.push({
      key: "h2",
      title: "Recover without panic",
      difficulty: "hard",
      minutes: 25,
      kind: "recovery",
      scenario:
        "You think you lost work. Stay calm — recovery starts with history tools, not re-cloning.",
      task: "1) Make at least one commit.\n2) Run git reflog and read the entries.\n3) Optionally practice git stash if you have dirty changes.",
      hints: [
        "reflog shows where HEAD has been — that is your parachute.",
        "On real Git you can recreate a branch from a hash you find in reflog.",
        "Do not re-clone as your first move.",
      ],
      referenceSolution:
        "git commit -m \"Safe point\"\ngit reflog\n(optional) git stash\ngit stash list",
      takeaways: [
        "reflog is the first recovery tool.",
        "Calm orientation beats destructive guesses.",
      ],
      validateIncludes: ["git reflog"],
    });
  }

  if (topicSlug === "final-workflow-project") {
    return [
      {
        key: "e1",
        title: "Final project — Bootstrap repo",
        difficulty: "easy",
        minutes: 12,
        kind: "terminal",
        scenario:
          "You are starting the acme-app final project from an empty workspace.",
        task: "1) Create a folder named acme-app with mkdir.\n2) cd into acme-app.\n3) Run git init.",
        hints: [
          "mkdir creates the folder; cd moves into it.",
          "git init only works inside the project folder.",
          "Confirm with pwd and ls after each step.",
        ],
        referenceSolution: "mkdir acme-app\ncd acme-app\ngit init\npwd",
        takeaways: ["Clean bootstrap is the foundation of every repo."],
        validateIncludes: ["git init"],
      },
      {
        key: "m1",
        title: "Final project — Feature branch and commit",
        difficulty: "medium",
        minutes: 18,
        kind: "git",
        scenario: "Ship a small feature branch the way a company team would.",
        task: "1) Create branch feature/home.\n2) Add a file.\n3) Stage and commit with a clear message.",
        hints: [
          "git checkout -b feature/home creates and switches in one step.",
          "touch README.md then git add . then git commit -m \"message\".",
        ],
        referenceSolution:
          "git checkout -b feature/home\ntouch home.txt\ngit add .\ngit commit -m \"Add home scaffold\"",
        takeaways: ["Feature branches keep main safe."],
        validateIncludes: ["git commit"],
      },
      {
        key: "h1",
        title: "Final project — Remote, push, and tag",
        difficulty: "hard",
        minutes: 25,
        kind: "scenario",
        scenario: "Publish your work and mark a release point.",
        task: "1) Add an origin remote.\n2) Push.\n3) Tag v1.0.0.",
        hints: [
          "git remote add origin https://github.com/you/acme-app.git",
          "Then git push and git tag v1.0.0",
        ],
        referenceSolution:
          "git remote add origin https://github.com/you/acme-app.git\ngit push\ngit tag v1.0.0",
        takeaways: ["Publish and release marking close the delivery loop."],
        validateIncludes: ["git push"],
      },
      {
        key: "h2",
        title: "Final project — Merge and prove history",
        difficulty: "hard",
        minutes: 25,
        kind: "scenario",
        scenario: "Integrate feature work and prove it with history.",
        task: "1) Merge a feature branch into your current branch.\n2) Run git log to show the result.",
        hints: [
          "Switch to main first if needed.",
          "git merge feature/home then git log",
        ],
        referenceSolution: "git checkout main\ngit merge feature/home\ngit log",
        takeaways: ["Log is proof for reviewers and for future you."],
        validateIncludes: ["git log"],
      },
    ];
  }

  return base;
}

function buildChallenge(topicSlug: string, topicTitle: string, spec: Spec): ToolingChallenge {
  const id = `dt-${topicSlug}-${spec.key}`;
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints
  );
  return {
    id,
    topicSlug,
    title: spec.title,
    difficulty: spec.difficulty,
    minutes: spec.minutes,
    kind: spec.kind,
    scenario: spec.scenario,
    task: spec.task,
    hints: spec.hints,
    referenceSolution: spec.referenceSolution,
    takeaways: spec.takeaways,
    validateIncludes: spec.validateIncludes,
    lesson,
    experience: "tooling",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ToolingChallenge[] = flattenToolingTopics().flatMap((topic) =>
  specsForTopic(topic.slug, topic.title).map((spec) =>
    buildChallenge(topic.slug, topic.title, spec)
  )
);

const BY_TOPIC = new Map<string, ToolingChallenge[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function listDeveloperToolingChallenges(topicSlug: string): ToolingChallenge[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function allDeveloperToolingChallenges(): ToolingChallenge[] {
  return BANK;
}

export function findDeveloperToolingChallenge(
  topicSlug: string,
  challengeId: string
): ToolingChallenge | null {
  const list = listDeveloperToolingChallenges(topicSlug);
  return list.find((c) => c.id === challengeId || c.lesson.id === challengeId) ?? null;
}

export function developerToolingTopicChallengeCount(topicSlug: string): number {
  return listDeveloperToolingChallenges(topicSlug).length;
}

/** Optional bridge if a solve view wants thinking-shaped data */
export function toolingChallengeAsThinking(
  challenge: ToolingChallenge
): ThinkingChallengeData {
  return {
    kind: "scenario",
    title: challenge.title,
    difficulty: challenge.difficulty,
    estimatedMinutes: challenge.minutes,
    scenario: challenge.scenario,
    task: challenge.task,
    hints: challenge.hints,
    referenceSolution: challenge.referenceSolution,
    takeaways: challenge.takeaways,
  };
}
