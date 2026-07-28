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

function trio(
  easy: Omit<Spec, "key" | "difficulty">,
  medium: Omit<Spec, "key" | "difficulty">,
  hard: Omit<Spec, "key" | "difficulty">,
  extra?: Spec[] | Spec
): Spec[] {
  const extras = Array.isArray(extra) ? extra : extra ? [extra] : [];
  return [
    { ...easy, key: "e1", difficulty: "easy" },
    { ...medium, key: "m1", difficulty: "medium" },
    { ...hard, key: "h1", difficulty: "hard" },
    ...extras,
  ];
}

/** Unique Easy / Medium / Hard challenges per topic — never the same prompt reused. */
const TOPIC_SPECS: Record<string, Spec[]> = {
  "what-is-terminal": trio(
    {
      title: "Orient yourself in the shell",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You just opened a terminal for the first time on a new machine. Before changing anything, professionals always orient themselves.",
      task: "1) Run pwd to print your current folder.\n2) Run ls to list what is here.\n3) Run whoami to see which user you are.",
      hints: [
        "pwd = print working directory.",
        "ls lists files and folders in the current place.",
        "whoami prints your username.",
      ],
      referenceSolution: "pwd\nls\nwhoami",
      takeaways: [
        "Orientation comes before action.",
        "pwd + ls is the everyday first move.",
      ],
      validateIncludes: ["pwd"],
    },
    {
      title: "Navigate into a project folder",
      minutes: 12,
      kind: "terminal",
      scenario:
        "A teammate says “open the projects folder and confirm you are inside it.” You must prove it with the terminal.",
      task: "1) List the current directory with ls.\n2) Move into projects with cd.\n3) Confirm with pwd that you are inside projects.",
      hints: [
        "cd projects moves into that folder.",
        "After cd, pwd should end with /projects.",
        "If cd fails, run ls to see the exact folder name.",
      ],
      referenceSolution: "ls\ncd projects\npwd",
      takeaways: [
        "Always verify after navigation.",
        "pwd is your proof of location.",
      ],
      validateIncludes: ["cd"],
    },
    {
      title: "Recover from getting lost in folders",
      minutes: 18,
      kind: "scenario",
      scenario:
        "You ran several cd commands and no longer know where you are. Panic is optional — orientation is not.",
      task: "1) Run pwd to see the full path.\n2) Run ls to see nearby folders.\n3) Use cd .. or cd /home/student to get back to a known place, then confirm with pwd.",
      hints: [
        "cd .. goes up one folder.",
        "cd /home/student jumps to the student home.",
        "Confirm every move with pwd.",
      ],
      referenceSolution: "pwd\nls\ncd /home/student\npwd",
      takeaways: [
        "Getting lost is normal; verifying location fixes it.",
        "Absolute paths are safe resets.",
      ],
      validateIncludes: ["pwd"],
    }
  ),

  "shells-compared": trio(
    {
      title: "Recognize which shell ideas are shared",
      minutes: 8,
      kind: "terminal",
      scenario:
        "CMD, PowerShell, Bash, and Zsh look different, but navigation ideas overlap. This warm-up uses shared commands available in the academy shell.",
      task: "1) Run pwd (Bash/Zsh style “where am I”).\n2) Run ls (list files).\n3) Run echo hello to print text — a concept every shell supports.",
      hints: [
        "In CMD the cousins are cd (with no args) and dir.",
        "PowerShell often uses Get-Location / Get-ChildItem.",
        "echo works across shells for printing text.",
      ],
      referenceSolution: "pwd\nls\necho hello",
      takeaways: [
        "Shells differ in syntax, not in purpose.",
        "Learn one deeply, map the others.",
      ],
      validateIncludes: ["echo"],
    },
    {
      title: "Use Bash-style navigation confidently",
      minutes: 14,
      kind: "terminal",
      scenario:
        "Your company uses Bash/Zsh on macOS/Linux. You need to move around like a daily Bash user — not PowerShell or CMD.",
      task: "1) Start at home and run pwd.\n2) cd into projects.\n3) List with ls, then go back up with cd .. and confirm with pwd.",
      hints: [
        "Bash navigation: pwd, ls, cd, cd ..",
        "CMD would use dir instead of ls.",
        "PowerShell often prefers Get-ChildItem.",
      ],
      referenceSolution: "pwd\ncd projects\nls\ncd ..\npwd",
      takeaways: [
        "Pick the shell vocabulary that matches the machine.",
        "Practice the dialect your team actually uses.",
      ],
      validateIncludes: ["ls"],
    },
    {
      title: "Explain shell choice for a new hire",
      minutes: 20,
      kind: "scenario",
      scenario:
        "A junior asks: “Should I learn CMD, PowerShell, or Bash first?” You will demonstrate Bash fundamentals they can transfer later.",
      task: "1) Show orientation: pwd + ls.\n2) Create a tiny folder with mkdir shell-lab.\n3) cd into it and prove location with pwd.\n4) Print a note with echo \"prefer Bash on servers\".",
      hints: [
        "Servers and most CI use Bash.",
        "Windows daily work may use PowerShell; Git Bash bridges both worlds.",
        "Demonstrate, then explain — do not only lecture.",
      ],
      referenceSolution:
        'pwd\nls\nmkdir shell-lab\ncd shell-lab\npwd\necho "prefer Bash on servers"',
      takeaways: [
        "Bash is the lingua franca of servers and CI.",
        "Teaching by demo beats abstract comparison.",
      ],
      validateIncludes: ["mkdir"],
    }
  ),

  "file-system-basics": trio(
    {
      title: "Absolute vs relative paths",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You must understand the difference between an absolute path (from the root) and a relative path (from here).",
      task: "1) Run pwd to see your absolute path.\n2) List with ls.\n3) cd into projects using a relative path, then run pwd again.",
      hints: [
        "Absolute paths start from / (e.g. /home/student).",
        "Relative paths are like projects or ../notes.",
        "pwd always prints the absolute location.",
      ],
      referenceSolution: "pwd\nls\ncd projects\npwd",
      takeaways: [
        "Absolute = full address; relative = from here.",
        "pwd converts confusion into an absolute fact.",
      ],
      validateIncludes: ["pwd"],
    },
    {
      title: "Walk a small directory tree",
      minutes: 14,
      kind: "terminal",
      scenario:
        "The file system is a tree. You need to create a nested path and prove you can move through it.",
      task: "1) mkdir labs\n2) mkdir labs/fs\n3) cd labs/fs\n4) Confirm with pwd that you are inside labs/fs.",
      hints: [
        "Create parents before children if mkdir -p is unavailable.",
        "Use relative paths: labs then labs/fs.",
        "pwd should include both labs and fs.",
      ],
      referenceSolution: "mkdir labs\nmkdir labs/fs\ncd labs/fs\npwd",
      takeaways: [
        "Folders nest; paths describe the nest.",
        "Build the tree, then navigate it.",
      ],
      validateIncludes: ["mkdir"],
    },
    {
      title: "Find your way home from deep folders",
      minutes: 18,
      kind: "scenario",
      scenario:
        "You are deep inside a tree and need to return home without guessing folder names one by one.",
      task: "1) Create and enter a nested path (e.g. mkdir deep; cd deep; mkdir nest; cd nest).\n2) Note pwd.\n3) Jump back to /home/student with an absolute cd, then verify with pwd.",
      hints: [
        "Absolute cd /home/student resets location instantly.",
        "cd .. only climbs one level at a time.",
        "Always verify with pwd after a jump.",
      ],
      referenceSolution:
        "mkdir deep\ncd deep\nmkdir nest\ncd nest\npwd\ncd /home/student\npwd",
      takeaways: [
        "Absolute paths are emergency exits.",
        "Know home so you can always reset.",
      ],
      validateIncludes: ["cd"],
    }
  ),

  "pwd-ls-cd": trio(
    {
      title: "Master the orientation trio",
      minutes: 8,
      kind: "terminal",
      scenario:
        "pwd, ls, and cd are the three commands you will use hundreds of times a week.",
      task: "1) pwd — where am I?\n2) ls — what is here?\n3) cd projects — move in, then pwd again.",
      hints: [
        "Order matters: see location, see contents, then move.",
        "After every cd, confirm with pwd.",
      ],
      referenceSolution: "pwd\nls\ncd projects\npwd",
      takeaways: ["Orientation loop: pwd → ls → cd → pwd."],
      validateIncludes: ["pwd"],
    },
    {
      title: "List, enter, and leave a folder",
      minutes: 12,
      kind: "terminal",
      scenario:
        "You need a clean loop: inspect → enter → inspect → leave.",
      task: "1) ls to see folders.\n2) cd projects and ls again.\n3) cd .. to leave, then pwd to confirm you left.",
      hints: [
        "cd .. moves up one level.",
        "ls inside projects should look different from home.",
      ],
      referenceSolution: "ls\ncd projects\nls\ncd ..\npwd",
      takeaways: ["Enter and leave deliberately — never guess."],
      validateIncludes: ["ls"],
    },
    {
      title: "Navigate with intent under time pressure",
      minutes: 16,
      kind: "scenario",
      scenario:
        "A senior asks you to open projects, confirm contents, return home, and prove each step — in under a minute.",
      task: "1) pwd\n2) cd projects && ls (or run them separately)\n3) cd /home/student\n4) Final pwd must show you are home.",
      hints: [
        "Prefer absolute home reset if you get lost mid-way.",
        "Narrate each step out loud as you type.",
      ],
      referenceSolution: "pwd\ncd projects\nls\ncd /home/student\npwd",
      takeaways: ["Speed comes from a practiced loop, not haste."],
      validateIncludes: ["cd"],
    }
  ),

  "mkdir-touch": trio(
    {
      title: "Create a folder and a file",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You need a scratch space named practice and an empty file inside it.",
      task: "1) mkdir practice\n2) touch practice/notes.txt\n3) ls practice to confirm the file exists.",
      hints: [
        "mkdir creates directories.",
        "touch creates an empty file (or updates timestamps).",
        "ls practice lists inside that folder.",
      ],
      referenceSolution: "mkdir practice\ntouch practice/notes.txt\nls practice",
      takeaways: ["mkdir for folders, touch for files."],
      validateIncludes: ["mkdir"],
    },
    {
      title: "Scaffold a mini app folder",
      minutes: 14,
      kind: "terminal",
      scenario:
        "Start a tiny app layout: app/ with index.js and README.md.",
      task: "1) mkdir app\n2) touch app/index.js\n3) touch app/README.md\n4) ls app to verify both files.",
      hints: [
        "Create the folder first, then the files inside it.",
        "File names are case-sensitive on many systems.",
      ],
      referenceSolution:
        "mkdir app\ntouch app/index.js\ntouch app/README.md\nls app",
      takeaways: ["Scaffold folders before writing real code."],
      validateIncludes: ["touch"],
    },
    {
      title: "Build a nested project skeleton",
      minutes: 18,
      kind: "scenario",
      scenario:
        "A lead wants src/ and tests/ under a new project called spark, plus a root README.",
      task: "1) mkdir spark\n2) mkdir spark/src and spark/tests\n3) touch spark/README.md and spark/src/main.js\n4) Prove with ls spark and ls spark/src.",
      hints: [
        "Create parent folders before nested ones.",
        "Use ls at each level to verify.",
      ],
      referenceSolution:
        "mkdir spark\nmkdir spark/src\nmkdir spark/tests\ntouch spark/README.md\ntouch spark/src/main.js\nls spark\nls spark/src",
      takeaways: ["Skeletons make teams productive faster."],
      validateIncludes: ["mkdir"],
    }
  ),

  "cp-mv-rm": trio(
    {
      title: "Copy a file safely",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You want a backup of notes.txt before editing it.",
      task: "1) Confirm notes.txt exists with ls.\n2) cp notes.txt notes.bak\n3) ls again to see both files.",
      hints: [
        "cp source destination",
        "Backups let you experiment without fear.",
      ],
      referenceSolution: "ls\ncp notes.txt notes.bak\nls",
      takeaways: ["Copy before risky edits."],
      validateIncludes: ["cp"],
    },
    {
      title: "Rename and relocate with mv",
      minutes: 12,
      kind: "terminal",
      scenario:
        "notes.bak should become backup.txt, then move into projects/.",
      task: "1) cp notes.txt notes.bak (if needed).\n2) mv notes.bak backup.txt\n3) mv backup.txt projects/\n4) ls projects to confirm.",
      hints: [
        "mv renames when destination is a new name in the same folder.",
        "mv also moves into another folder.",
      ],
      referenceSolution:
        "cp notes.txt notes.bak\nmv notes.bak backup.txt\nmv backup.txt projects/\nls projects",
      takeaways: ["mv = rename or move depending on the destination."],
      validateIncludes: ["mv"],
    },
    {
      title: "Clean up without deleting the wrong thing",
      minutes: 16,
      kind: "scenario",
      scenario:
        "You created temp files during practice. Remove only the disposable ones — never the originals you still need.",
      task: "1) cp notes.txt temp-notes.txt\n2) ls to identify temp-notes.txt\n3) rm temp-notes.txt\n4) ls again and confirm notes.txt still exists.",
      hints: [
        "rm deletes permanently in many shells — double-check the name.",
        "Never rm a file you have not listed first.",
      ],
      referenceSolution: "cp notes.txt temp-notes.txt\nls\nrm temp-notes.txt\nls",
      takeaways: ["List before delete. Prefer copies when unsure."],
      validateIncludes: ["rm"],
    }
  ),

  "cat-clear-history": trio(
    {
      title: "Read a file with cat",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You need to read notes.txt without opening a GUI editor.",
      task: "1) ls to confirm notes.txt\n2) cat notes.txt to print its contents.",
      hints: ["cat prints the whole file to the terminal."],
      referenceSolution: "ls\ncat notes.txt",
      takeaways: ["cat is the fastest way to peek at small files."],
      validateIncludes: ["cat"],
    },
    {
      title: "Clear the screen and re-check history",
      minutes: 12,
      kind: "terminal",
      scenario:
        "Your terminal is noisy. Clear it, run a few useful commands, then inspect history.",
      task: "1) clear the screen.\n2) Run pwd and ls.\n3) Run history and find those commands in the list.",
      hints: [
        "clear wipes the visible screen, not your command history.",
        "history lists recent commands.",
      ],
      referenceSolution: "clear\npwd\nls\nhistory",
      takeaways: ["Clear for focus; history for recall."],
      validateIncludes: ["history"],
    },
    {
      title: "Reproduce a previous workflow from history",
      minutes: 16,
      kind: "scenario",
      scenario:
        "You did something useful earlier but forgot the exact sequence. History is your memory.",
      task: "1) Run a short sequence: pwd, ls, cat notes.txt.\n2) Run history.\n3) Re-run cat notes.txt deliberately (type it again) after reading history.",
      hints: [
        "In real shells, ↑ recalls previous lines.",
        "Here, read history then retype the command you need.",
      ],
      referenceSolution: "pwd\nls\ncat notes.txt\nhistory\ncat notes.txt",
      takeaways: ["History turns “I forgot” into “I can replay.”"],
      validateIncludes: ["history"],
    }
  ),

  "find-grep": trio(
    {
      title: "Find a file by name",
      minutes: 8,
      kind: "terminal",
      scenario:
        "You remember a file named notes but not exactly where it lives.",
      task: "1) Run find . -name notes (or find toward notes.txt).\n2) Confirm with ls or cat once you see the path.",
      hints: [
        "find searches the tree from a starting point.",
        "Start from . (current folder).",
      ],
      referenceSolution: "find . -name notes\ncat notes.txt",
      takeaways: ["find locates files; you still verify the path."],
      validateIncludes: ["find"],
    },
    {
      title: "Search file contents with grep",
      minutes: 12,
      kind: "terminal",
      scenario:
        "You need the line inside notes.txt that contains “Welcome”.",
      task: "1) grep Welcome notes.txt\n2) Optionally cat notes.txt to see full context.",
      hints: ["grep pattern file prints matching lines."],
      referenceSolution: "grep Welcome notes.txt",
      takeaways: ["grep finds text; find finds files."],
      validateIncludes: ["grep"],
    },
    {
      title: "Combine find and grep in an investigation",
      minutes: 18,
      kind: "scenario",
      scenario:
        "A bug report says “something about Welcome is in the notes.” Locate the file, then the line.",
      task: "1) find . -name notes\n2) grep Welcome notes.txt\n3) cat notes.txt to confirm the surrounding text.",
      hints: [
        "Locate first, then search content.",
        "Do not grep randomly across the whole disk until you know the file.",
      ],
      referenceSolution: "find . -name notes\ngrep Welcome notes.txt\ncat notes.txt",
      takeaways: ["Investigation order: locate → search → read."],
      validateIncludes: ["grep"],
    }
  ),

  "env-and-path": trio(
    {
      title: "Print an environment variable",
      minutes: 8,
      kind: "terminal",
      scenario:
        "Environment variables configure tools. Start by reading PATH.",
      task: "1) echo $PATH\n2) Run env (or printenv) and spot PATH in the list.",
      hints: [
        "echo $PATH prints the PATH variable.",
        "env lists many variables at once.",
      ],
      referenceSolution: "echo $PATH\nenv",
      takeaways: ["PATH tells the shell where to find programs."],
      validateIncludes: ["echo"],
    },
    {
      title: "Set a temporary project variable",
      minutes: 12,
      kind: "terminal",
      scenario:
        "You want COURSE=tooling available in this shell session.",
      task: "1) export COURSE=tooling\n2) echo $COURSE to prove it.\n3) Optionally run env and find COURSE.",
      hints: [
        "export NAME=value sets a variable for this session.",
        "echo $COURSE reads it back.",
      ],
      referenceSolution: "export COURSE=tooling\necho $COURSE",
      takeaways: ["export configures the current shell session."],
      validateIncludes: ["export"],
    },
    {
      title: "Debug a missing command via PATH thinking",
      minutes: 18,
      kind: "debug",
      scenario:
        "Someone says “command not found.” Before installing anything, check orientation and PATH.",
      task: "1) pwd and whoami to orient.\n2) echo $PATH\n3) export APP_ENV=dev and echo $APP_ENV to prove you can set vars while debugging.",
      hints: [
        "command not found often means the binary is not on PATH.",
        "Confirm you are in the right folder and user before changing PATH.",
      ],
      referenceSolution:
        "pwd\nwhoami\necho $PATH\nexport APP_ENV=dev\necho $APP_ENV",
      takeaways: ["Debug PATH after confirming who/where you are."],
      validateIncludes: ["export"],
    }
  ),

  "permissions-basics": trio(
    {
      title: "Inspect who you are before permission issues",
      minutes: 8,
      kind: "terminal",
      scenario:
        "Permission errors are about identity + ownership. Start with identity.",
      task: "1) whoami\n2) pwd\n3) ls to see what you can currently access.",
      hints: ["whoami tells which user the shell is acting as."],
      referenceSolution: "whoami\npwd\nls",
      takeaways: ["Know your user before chasing permission errors."],
      validateIncludes: ["whoami"],
    },
    {
      title: "Create files you own in your home tree",
      minutes: 12,
      kind: "terminal",
      scenario:
        "Practice creating content in a place you control — your home workspace.",
      task: "1) mkdir secure-lab\n2) touch secure-lab/owned.txt\n3) cat is optional; ls secure-lab to confirm ownership path exists.",
      hints: [
        "Files you create under your home are usually yours.",
        "Permission problems often appear outside your home.",
      ],
      referenceSolution: "mkdir secure-lab\ntouch secure-lab/owned.txt\nls secure-lab",
      takeaways: ["Create and edit in directories you own."],
      validateIncludes: ["mkdir"],
    },
    {
      title: "Permission mindset under a blocked write",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Imagine a deploy script failed with “Permission denied.” You cannot chmod in this simulator — practice the diagnostic sequence instead.",
      task: "1) whoami + pwd\n2) ls the target folder\n3) Create a writable workspace mkdir writable-zone and touch writable-zone/ok.txt as your safe alternative path.",
      hints: [
        "Diagnosis before force: who, where, what exists.",
        "If a path is blocked, use a path you control while you escalate.",
      ],
      referenceSolution:
        "whoami\npwd\nls\nmkdir writable-zone\ntouch writable-zone/ok.txt",
      takeaways: ["Diagnose identity and location before forcing access."],
      validateIncludes: ["whoami"],
    }
  ),

  "what-is-git": trio(
    {
      title: "Initialize your first repository",
      minutes: 8,
      kind: "git",
      scenario:
        "Git is a version control system. Start by turning this folder into a repository.",
      task: "1) git init\n2) git status and read the message carefully.",
      hints: [
        "git init creates the .git directory.",
        "status should no longer say “not a git repository”.",
      ],
      referenceSolution: "git init\ngit status",
      takeaways: ["A repo starts with git init."],
      validateIncludes: ["git init"],
    },
    {
      title: "Make Git track a real file",
      minutes: 14,
      kind: "git",
      scenario:
        "An empty repo is not useful until it tracks work. Add a README and commit it.",
      task: "1) git init (if needed)\n2) touch README.md\n3) git add README.md\n4) git commit -m \"Initial commit\"\n5) git status",
      hints: [
        "add stages; commit snapshots.",
        "status should be clean after a successful commit.",
      ],
      referenceSolution:
        'git init\ntouch README.md\ngit add README.md\ngit commit -m "Initial commit"\ngit status',
      takeaways: ["Working tree → staging → commit."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Prove Git history exists",
      minutes: 18,
      kind: "scenario",
      scenario:
        "A reviewer asks: “Show me that Git is actually tracking this project.”",
      task: "1) Ensure the repo is initialized and has at least one commit.\n2) Run git log\n3) Run git status to show a clean tree.",
      hints: [
        "log shows commits; status shows current dirtiness.",
        "Make a commit first if log is empty.",
      ],
      referenceSolution:
        'git init\ntouch proof.txt\ngit add .\ngit commit -m "Prove history"\ngit log\ngit status',
      takeaways: ["History (log) is the product Git sells."],
      validateIncludes: ["git log"],
    }
  ),

  "why-git-exists": trio(
    {
      title: "See the problem Git solves with status",
      minutes: 8,
      kind: "git",
      scenario:
        "Without Git, “final_final_v3” files pile up. Status is how Git shows change clearly.",
      task: "1) git init\n2) touch draft.txt\n3) git status and notice the untracked file.",
      hints: ["Untracked means Git sees the file but is not recording it yet."],
      referenceSolution: "git init\ntouch draft.txt\ngit status",
      takeaways: ["Git makes change visible instead of guessing filenames."],
      validateIncludes: ["git status"],
    },
    {
      title: "Capture a safe checkpoint",
      minutes: 14,
      kind: "git",
      scenario:
        "You are about to try a risky edit. Commit a checkpoint first — that is why Git exists.",
      task: "1) touch experiment.txt\n2) git add experiment.txt\n3) git commit -m \"Checkpoint before experiment\"\n4) git status",
      hints: ["Commits are restore points, not just uploads."],
      referenceSolution:
        'git init\ntouch experiment.txt\ngit add experiment.txt\ngit commit -m "Checkpoint before experiment"\ngit status',
      takeaways: ["Commit before risk."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Compare two moments with log",
      minutes: 18,
      kind: "scenario",
      scenario:
        "A teammate wants two checkpoints so you can talk about what changed over time.",
      task: "1) Make commit one (e.g. touch a.txt; add; commit).\n2) Make commit two with another file.\n3) git log to show both moments.",
      hints: ["Two commits create a timeline you can discuss."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "First moment"\ntouch b.txt\ngit add .\ngit commit -m "Second moment"\ngit log',
      takeaways: ["Git exists so time travel is intentional."],
      validateIncludes: ["git log"],
    }
  ),

  "repo-staging-commit": trio(
    {
      title: "Stage a single file",
      minutes: 8,
      kind: "git",
      scenario:
        "Staging lets you choose exactly what enters the next commit.",
      task: "1) git init\n2) touch app.js\n3) git add app.js\n4) git status and confirm it is staged.",
      hints: ["git add moves changes into the staging area."],
      referenceSolution: "git init\ntouch app.js\ngit add app.js\ngit status",
      takeaways: ["Staging is a deliberate selection step."],
      validateIncludes: ["git add"],
    },
    {
      title: "Commit with a clear message",
      minutes: 12,
      kind: "git",
      scenario:
        "Vague messages waste future you. Practice a meaningful commit.",
      task: "1) Create and stage README.md\n2) git commit -m \"Add project README\"\n3) git status should be clean.",
      hints: ["Messages should say why/what, not just “update”."],
      referenceSolution:
        'git init\ntouch README.md\ngit add README.md\ngit commit -m "Add project README"\ngit status',
      takeaways: ["Good messages are part of the craft."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Separate two logical commits",
      minutes: 20,
      kind: "scenario",
      scenario:
        "Do not dump unrelated files into one commit. Make two focused commits.",
      task: "1) Commit docs: README.md alone.\n2) Commit code: app.js alone.\n3) git log should show two commits.",
      hints: [
        "Stage and commit one concern at a time.",
        "Avoid git add . if it would mix concerns.",
      ],
      referenceSolution:
        'git init\ntouch README.md\ngit add README.md\ngit commit -m "Add README"\ntouch app.js\ngit add app.js\ngit commit -m "Add app entry"\ngit log',
      takeaways: ["Atomic commits keep history useful."],
      validateIncludes: ["git commit"],
    }
  ),

  "branches-and-head": trio(
    {
      title: "Create and list a branch",
      minutes: 8,
      kind: "git",
      scenario:
        "Branches let you isolate work. Start by creating one.",
      task: "1) Ensure a repo with at least one commit.\n2) git branch feature-login\n3) git branch to list branches.",
      hints: [
        "You usually need a commit before branching is useful.",
        "git branch lists local branches.",
      ],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ngit branch feature-login\ngit branch',
      takeaways: ["Branches are movable pointers to commits."],
      validateIncludes: ["git branch"],
    },
    {
      title: "Switch onto a feature branch",
      minutes: 14,
      kind: "git",
      scenario:
        "Creating a branch is not enough — you must move HEAD onto it.",
      task: "1) Create feature-login.\n2) git switch feature-login (or checkout).\n3) git status should show the branch name.",
      hints: ["git switch moves HEAD to the branch."],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ngit branch feature-login\ngit switch feature-login\ngit status',
      takeaways: ["HEAD marks where you are working."],
      validateIncludes: ["git switch"],
    },
    {
      title: "Tag a release point on main",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Branches move; tags mark a release. Practice both.",
      task: "1) Commit on main.\n2) Create and switch to a feature branch, commit once.\n3) Switch back to main and git tag v0.1.0.",
      hints: [
        "Tags label a specific commit for releases.",
        "Confirm branch with git status before tagging.",
      ],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ngit checkout -b feature-login\ntouch login.txt\ngit add .\ngit commit -m "WIP login"\ngit switch main\ngit tag v0.1.0',
      takeaways: ["Branches experiment; tags release."],
      validateIncludes: ["git tag"],
    }
  ),

  "diff-log-history": trio(
    {
      title: "Read your commit history",
      minutes: 8,
      kind: "git",
      scenario:
        "log answers “what happened?” — the first history tool.",
      task: "1) Make at least one commit.\n2) git log and read the message.",
      hints: ["Empty repos have nothing to log — commit first."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "First"\ngit log',
      takeaways: ["log is the timeline."],
      validateIncludes: ["git log"],
    },
    {
      title: "Inspect unstaged changes with diff",
      minutes: 12,
      kind: "git",
      scenario:
        "diff shows what changed before you commit.",
      task: "1) Commit a file once.\n2) Change the tree by adding another file (or re-touch).\n3) git add if needed, then git diff / git status to inspect.\n4) Prefer finishing with git status after exploring.",
      hints: [
        "status summarizes; diff details.",
        "In this simulator, create a second untracked/changed file and inspect with status + diff.",
      ],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "Base"\ntouch b.txt\ngit status\ngit diff',
      takeaways: ["Read the diff before you commit."],
      validateIncludes: ["git diff"],
    },
    {
      title: "Narrate history for a reviewer",
      minutes: 18,
      kind: "scenario",
      scenario:
        "A reviewer asks for the story of your last two commits.",
      task: "1) Create two meaningful commits.\n2) git log\n3) git status to confirm a clean ending.",
      hints: ["Commit messages should make the log readable aloud."],
      referenceSolution:
        'git init\ntouch one.txt\ngit add .\ngit commit -m "Add one"\ntouch two.txt\ngit add .\ngit commit -m "Add two"\ngit log\ngit status',
      takeaways: ["Readable history is a team skill."],
      validateIncludes: ["git log"],
    }
  ),

  "reset-checkout-restore": trio(
    {
      title: "Unstage with reset",
      minutes: 10,
      kind: "git",
      scenario:
        "You staged too much. reset (mixed) puts staging back without destroying files.",
      task: "1) touch extra.txt and git add extra.txt\n2) git status to see it staged\n3) git reset\n4) git status again — file should be unstaged/untracked as appropriate.",
      hints: ["git reset without paths unstages staged changes in this simulator."],
      referenceSolution:
        "git init\ntouch extra.txt\ngit add extra.txt\ngit status\ngit reset\ngit status",
      takeaways: ["reset can unstage safely when used carefully."],
      validateIncludes: ["git reset"],
    },
    {
      title: "Move between commits with checkout safety",
      minutes: 14,
      kind: "git",
      scenario:
        "checkout/switch moves HEAD. Practice switching branches instead of destructive resets.",
      task: "1) Create main commit + feature branch with a commit.\n2) git switch main\n3) git status to confirm you landed cleanly.",
      hints: ["Prefer switch/branch over hard reset when learning."],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ngit checkout -b try-feature\ntouch feat.txt\ngit add .\ngit commit -m "Feat"\ngit switch main\ngit status',
      takeaways: ["Move HEAD with switch; avoid hard reset as a first habit."],
      validateIncludes: ["git switch"],
    },
    {
      title: "Prefer restore mindset over panic reset",
      minutes: 20,
      kind: "recovery",
      scenario:
        "Hard reset can delete uncommitted work. Practice a calm restore path: status → stash or commit → then adjust.",
      task: "1) Make a commit.\n2) Create dirty work with touch wip.txt\n3) git stash (or commit) to save it\n4) git status should look safe again.",
      hints: [
        "Do not jump to reset --hard.",
        "stash or commit preserves work.",
      ],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ntouch wip.txt\ngit stash\ngit status',
      takeaways: ["Preserve first, rewrite second."],
      validateIncludes: ["git stash"],
    }
  ),

  "merge-rebase-cherry": [
    ...trio(
      {
        title: "Merge a feature branch into main",
        minutes: 12,
        kind: "git",
        scenario:
          "Merging combines histories. Practice a clean merge.",
        task: "1) Commit on main.\n2) Create feature-login, commit there.\n3) Switch to main and git merge feature-login.\n4) Confirm with git log or git status.",
        hints: ["Commit on both sides before merging."],
        referenceSolution:
          'git init\ntouch main.txt\ngit add .\ngit commit -m "Main base"\ngit checkout -b feature-login\ntouch login.txt\ngit add .\ngit commit -m "Add login"\ngit switch main\ngit merge feature-login\ngit status',
        takeaways: ["Merge integrates finished branch work."],
        validateIncludes: ["git merge"],
      },
      {
        title: "Rebase practice for a linear history",
        minutes: 16,
        kind: "git",
        scenario:
          "Teams sometimes rebase feature branches onto main for a cleaner timeline. Practice the command safely here.",
        task: "1) Create commits on main and on a feature branch.\n2) From the feature branch, run git rebase main (simulator-supported).\n3) Finish with git status.",
        hints: [
          "Rebase replays your commits on top of another base.",
          "Do not rebase shared public history without team agreement.",
        ],
        referenceSolution:
          'git init\ntouch main.txt\ngit add .\ngit commit -m "Main"\ngit checkout -b feature-x\ntouch x.txt\ngit add .\ngit commit -m "X"\ngit rebase main\ngit status',
        takeaways: ["Rebase is powerful — use with team rules."],
        validateIncludes: ["git rebase"],
      },
      {
        title: "Cherry-pick one commit onto main",
        minutes: 20,
        kind: "scenario",
        scenario:
          "You need only one commit from a branch, not the whole merge.",
        task: "1) Create a feature branch with a commit.\n2) Switch to main.\n3) git cherry-pick with the feature tip (simulator accepts cherry-pick).\n4) Verify with git log.",
        hints: ["Cherry-pick copies a single commit’s changes."],
        referenceSolution:
          'git init\ntouch main.txt\ngit add .\ngit commit -m "Main"\ngit checkout -b hotfix\ntouch fix.txt\ngit add .\ngit commit -m "Hotfix"\ngit switch main\ngit cherry-pick hotfix\ngit log',
        takeaways: ["Cherry-pick surgically copies one change."],
        validateIncludes: ["git cherry-pick"],
      }
    ),
    {
      key: "h2",
      title: "Merge calmly under pressure",
      difficulty: "hard",
      minutes: 25,
      kind: "debug",
      scenario:
        "Two branches contain related work. Combine them without panicking.",
      task: "1) Create two branches and commit on each.\n2) Switch back to main.\n3) git merge the first feature.\n4) Confirm with git status or git log.",
      hints: [
        "Commit on both branches before you merge.",
        "After merge, status should look clean if it succeeded.",
      ],
      referenceSolution:
        "git checkout -b feature-a\n(commit)\ngit checkout main\ngit checkout -b feature-b\n(commit)\ngit checkout main\ngit merge feature-a\ngit status",
      takeaways: [
        "Merges are normal team work, not emergencies.",
        "Always verify with status after combining history.",
      ],
      validateIncludes: ["git merge"],
    },
  ],

  "stash-and-reflog": trio(
    {
      title: "Stash dirty work quickly",
      minutes: 10,
      kind: "git",
      scenario:
        "You must switch context but have unfinished edits.",
      task: "1) Commit a base file.\n2) touch wip.txt\n3) git stash\n4) git status should look clean.",
      hints: ["stash shelves uncommitted work temporarily."],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ntouch wip.txt\ngit stash\ngit status',
      takeaways: ["Stash clears the way without committing half-work."],
      validateIncludes: ["git stash"],
    },
    {
      title: "List and restore a stash",
      minutes: 14,
      kind: "git",
      scenario:
        "You stashed earlier — now bring the work back.",
      task: "1) Create dirty work and git stash.\n2) git stash list\n3) git stash pop (or apply)\n4) git status to see the restored files.",
      hints: ["stash list shows shelf entries; pop restores the latest."],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ntouch wip.txt\ngit stash\ngit stash list\ngit stash pop\ngit status',
      takeaways: ["List before pop when multiple stashes exist."],
      validateIncludes: ["git stash"],
    },
    {
      title: "Use reflog as your parachute",
      minutes: 20,
      kind: "recovery",
      scenario:
        "You fear you “lost” a commit. reflog shows where HEAD has been.",
      task: "1) Make at least one commit.\n2) Create another commit or switch branches.\n3) git reflog and read the entries.",
      hints: ["reflog is the first recovery tool — before re-cloning."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "One"\ntouch b.txt\ngit add .\ngit commit -m "Two"\ngit reflog',
      takeaways: ["reflog remembers HEAD movement."],
      validateIncludes: ["git reflog"],
    }
  ),

  "github-repos-clone-fork": trio(
    {
      title: "Add an origin remote",
      minutes: 10,
      kind: "git",
      scenario:
        "GitHub hosts remotes. Connect this local repo to an origin URL.",
      task: "1) git init + one commit.\n2) git remote add origin https://github.com/you/app.git\n3) git remote -v",
      hints: ["remote add links a name (origin) to a URL."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/you/app.git\ngit remote -v',
      takeaways: ["origin is the conventional default remote name."],
      validateIncludes: ["git remote"],
    },
    {
      title: "Push your first branch to origin",
      minutes: 14,
      kind: "git",
      scenario:
        "Local commits are private until you push.",
      task: "1) Add origin remote.\n2) git push\n3) Confirm with git status or remote -v.",
      hints: ["Push publishes commits to the remote."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/you/app.git\ngit push',
      takeaways: ["Push shares your branch with GitHub."],
      validateIncludes: ["git push"],
    },
    {
      title: "Simulate clone mindset: remote then verify",
      minutes: 18,
      kind: "scenario",
      scenario:
        "After cloning (or linking) a repo, always verify remotes and status before coding.",
      task: "1) Initialize and commit.\n2) Add origin.\n3) git remote -v\n4) git status\n5) git log",
      hints: ["Verification prevents pushing to the wrong remote."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/org/app.git\ngit remote -v\ngit status\ngit log',
      takeaways: ["Verify remote + status after every clone/link."],
      validateIncludes: ["git remote"],
    }
  ),

  "ssh-https-tokens": trio(
    {
      title: "Choose an HTTPS remote URL",
      minutes: 8,
      kind: "git",
      scenario:
        "HTTPS remotes are common for beginners using tokens.",
      task: "1) git init + commit.\n2) git remote add origin https://github.com/you/secure-app.git\n3) git remote -v",
      hints: ["HTTPS URLs start with https://github.com/..."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/you/secure-app.git\ngit remote -v',
      takeaways: ["HTTPS + token is a valid auth path."],
      validateIncludes: ["git remote"],
    },
    {
      title: "Record an SSH-style remote",
      minutes: 12,
      kind: "git",
      scenario:
        "SSH remotes look like git@github.com:you/app.git — practice adding one.",
      task: "1) Initialize + commit.\n2) Add origin with an SSH-style URL.\n3) git remote -v to confirm.",
      hints: ["SSH URLs use git@github.com:owner/repo.git"],
      referenceSolution:
        "git init\ntouch README.md\ngit add .\ngit commit -m \"Init\"\ngit remote add origin git@github.com:you/secure-app.git\ngit remote -v",
      takeaways: ["SSH keys unlock passwordless GitHub auth."],
      validateIncludes: ["git remote"],
    },
    {
      title: "Auth failure checklist (without panicking)",
      minutes: 18,
      kind: "debug",
      scenario:
        "Push failed with auth errors. Practice the calm checklist in the terminal.",
      task: "1) git remote -v (confirm URL type)\n2) git status\n3) Re-add or keep origin correctly, then attempt git push once.",
      hints: [
        "Wrong remote URL is a common auth “failure”.",
        "Fix URL/identity before regenerating keys blindly.",
      ],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin git@github.com:you/secure-app.git\ngit remote -v\ngit status\ngit push',
      takeaways: ["Verify remote URL before deeper auth debugging."],
      validateIncludes: ["git push"],
    }
  ),

  "issues-actions-releases": trio(
    {
      title: "Mark a release candidate with a tag",
      minutes: 8,
      kind: "git",
      scenario:
        "Releases are often tied to Git tags that Actions can publish.",
      task: "1) Make a commit.\n2) git tag v0.1.0\n3) git log (or status) to confirm you are on a clean commit.",
      hints: ["Tags label release points for humans and CI."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Ready"\ngit tag v0.1.0',
      takeaways: ["Tags connect Git history to releases."],
      validateIncludes: ["git tag"],
    },
    {
      title: "Ship a branch so Actions can see it",
      minutes: 14,
      kind: "git",
      scenario:
        "CI (Actions) runs on pushed branches and tags. Practice publishing.",
      task: "1) Add origin.\n2) Commit on a feature branch.\n3) git push",
      hints: ["No push → no CI on GitHub."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit checkout -b feature/ci\ntouch app.txt\ngit add .\ngit commit -m "Trigger CI"\ngit remote add origin https://github.com/you/app.git\ngit push',
      takeaways: ["Push is what makes Actions wake up."],
      validateIncludes: ["git push"],
    },
    {
      title: "Release hygiene: tag after a clean status",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Never tag a dirty tree. Prove clean status, then tag a release.",
      task: "1) Commit all work.\n2) git status must be clean.\n3) git tag v1.0.0-rc.1\n4) git log",
      hints: ["Release tags should point at intentional commits."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Release candidate"\ngit status\ngit tag v1.0.0-rc.1\ngit log',
      takeaways: ["Clean tree → tag → announce."],
      validateIncludes: ["git tag"],
    }
  ),

  "collaborators-and-security": trio(
    {
      title: "Inspect remotes before granting access",
      minutes: 8,
      kind: "git",
      scenario:
        "Security starts with knowing where code pushes go.",
      task: "1) Add an origin remote.\n2) git remote -v\n3) git status",
      hints: ["Confirm the org/user in the URL before inviting collaborators."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/acme/app.git\ngit remote -v\ngit status',
      takeaways: ["Know the remote before sharing access."],
      validateIncludes: ["git remote"],
    },
    {
      title: "Keep secrets out of commits",
      minutes: 14,
      kind: "git",
      scenario:
        "Never commit .env secrets. Practice committing only safe files.",
      task: "1) touch README.md and touch .env.example (safe template only).\n2) Stage README.md (and optionally .env.example).\n3) Commit with message \"Add safe project files\"\n4) git status",
      hints: [
        "Do not invent real secrets in the simulator.",
        ".env.example is documentation; .env is secret.",
      ],
      referenceSolution:
        'git init\ntouch README.md\ntouch .env.example\ngit add README.md .env.example\ngit commit -m "Add safe project files"\ngit status',
      takeaways: ["Commit templates, never live secrets."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Protected main mindset: use a feature branch",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Companies protect main. Practice shipping via a branch instead of committing only on main.",
      task: "1) Seed main with a commit.\n2) git checkout -b feature/safe-change\n3) Commit a change on the feature branch.\n4) git status shows you are not casually editing unprotected main-only flow.",
      hints: ["Short-lived feature branches are the security-friendly default."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Main"\ngit checkout -b feature/safe-change\ntouch change.txt\ngit add .\ngit commit -m "Safe change"\ngit status',
      takeaways: ["Protected main + PRs beat direct pushes."],
      validateIncludes: ["git checkout"],
    }
  ),

  "daily-loop": trio(
    {
      title: "Start the day: status first",
      minutes: 8,
      kind: "git",
      scenario:
        "Daily loop begins with orientation — never with random commits.",
      task: "1) git init if needed\n2) git status\n3) Optionally git log",
      hints: ["Status tells you if yesterday left a dirty tree."],
      referenceSolution: "git init\ngit status",
      takeaways: ["Start every day with status."],
      validateIncludes: ["git status"],
    },
    {
      title: "Mid-day feature branch commit",
      minutes: 14,
      kind: "git",
      scenario:
        "You pick up a ticket. Branch, change, commit.",
      task: "1) git checkout -b feature/daily\n2) touch work.txt\n3) git add . && git commit -m \"Progress on daily ticket\"\n4) git status",
      hints: ["One ticket → one branch when possible."],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ngit checkout -b feature/daily\ntouch work.txt\ngit add .\ngit commit -m "Progress on daily ticket"\ngit status',
      takeaways: ["Branch early in the daily loop."],
      validateIncludes: ["git commit"],
    },
    {
      title: "End the day: clean tree or stash",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Leaving a dirty tree overnight confuses tomorrow-you. Finish clean.",
      task: "1) If you have WIP, either commit it or git stash.\n2) git status must end clean.\n3) git log to see today’s commits.",
      hints: ["Clean means committed or stashed — not abandoned."],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ntouch wip.txt\ngit stash\ngit status\ngit log',
      takeaways: ["End clean: commit or stash."],
      validateIncludes: ["git status"],
    }
  ),

  "scenario-login-page": trio(
    {
      title: "Ticket intake: branch for login page",
      minutes: 10,
      kind: "git",
      scenario:
        "CEO asks for a login page. You do not start on main — you branch.",
      task: "1) Seed main.\n2) git switch -c feature/login-page\n3) git status confirms the branch.",
      hints: ["Name branches after the work: feature/login-page."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit switch -c feature/login-page\ngit status',
      takeaways: ["Every request gets a branch."],
      validateIncludes: ["git switch"],
    },
    {
      title: "Deliver a login scaffold commit",
      minutes: 14,
      kind: "git",
      scenario:
        "Create a minimal login artifact and commit it on the feature branch.",
      task: "1) On feature/login-page, touch login.html\n2) Commit with message \"Add login page scaffold\"\n3) git log",
      hints: ["Small scaffold commits unlock review early."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit switch -c feature/login-page\ntouch login.html\ngit add .\ngit commit -m "Add login page scaffold"\ngit log',
      takeaways: ["Ship scaffolds early for feedback."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Ready for review: push login branch",
      minutes: 18,
      kind: "scenario",
      scenario:
        "The scaffold is ready. Publish the branch so others can review.",
      task: "1) Ensure feature/login-page has a commit.\n2) Add origin remote.\n3) git push\n4) git status",
      hints: ["Pushing the feature branch enables the PR conversation."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit switch -c feature/login-page\ntouch login.html\ngit add .\ngit commit -m "Add login page scaffold"\ngit remote add origin https://github.com/acme/app.git\ngit push\ngit status',
      takeaways: ["Branch + commit + push = ready for PR."],
      validateIncludes: ["git push"],
    }
  ),

  "pull-requests-review": trio(
    {
      title: "Publish a branch for review",
      minutes: 10,
      kind: "git",
      scenario:
        "A PR needs a remote branch. Push your feature work.",
      task: "1) Create feature/x with a commit.\n2) Add origin.\n3) git push",
      hints: ["No remote branch → no pull request."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit checkout -b feature/x\ntouch x.txt\ngit add .\ngit commit -m "Add x"\ngit remote add origin https://github.com/you/app.git\ngit push',
      takeaways: ["Push is the share-for-review step."],
      validateIncludes: ["git push"],
    },
    {
      title: "Update a PR with a follow-up commit",
      minutes: 14,
      kind: "git",
      scenario:
        "Reviewer requested a tiny change. Commit and push again.",
      task: "1) On your feature branch, add a file fix.txt\n2) Commit \"Address review feedback\"\n3) git push",
      hints: ["Follow-up commits keep the same PR alive."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit checkout -b feature/x\ntouch x.txt\ngit add .\ngit commit -m "Add x"\ngit remote add origin https://github.com/you/app.git\ngit push\ntouch fix.txt\ngit add .\ngit commit -m "Address review feedback"\ngit push',
      takeaways: ["Respond to review with clear commits."],
      validateIncludes: ["git push"],
    },
    {
      title: "Merge after approval (local rehearsal)",
      minutes: 18,
      kind: "scenario",
      scenario:
        "PR approved. Rehearse merging the feature branch into main locally.",
      task: "1) feature branch with commits exists.\n2) git switch main\n3) git merge feature/x\n4) git log",
      hints: ["Local merge mirrors what GitHub merge does to history."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Seed"\ngit checkout -b feature/x\ntouch x.txt\ngit add .\ngit commit -m "Add x"\ngit switch main\ngit merge feature/x\ngit log',
      takeaways: ["Approved PR → merge → verify log."],
      validateIncludes: ["git merge"],
    }
  ),

  "merge-conflicts": trio(
    {
      title: "Create the conditions for a merge",
      minutes: 12,
      kind: "git",
      scenario:
        "Conflicts appear when branches diverge. First practice a clean merge setup.",
      task: "1) Commit on main.\n2) Branch and commit elsewhere.\n3) Merge back into main.\n4) git status",
      hints: ["Understand clean merges before conflict drama."],
      referenceSolution:
        'git init\ntouch shared.txt\ngit add .\ngit commit -m "Base"\ngit checkout -b feature-a\ntouch a.txt\ngit add .\ngit commit -m "A"\ngit switch main\ngit merge feature-a\ngit status',
      takeaways: ["Most merges are calm when changes do not overlap."],
      validateIncludes: ["git merge"],
    },
    {
      title: "Resolve workflow: status → add → commit",
      minutes: 16,
      kind: "git",
      scenario:
        "After a conflict (or practice merge), the finish line is add + commit.",
      task: "1) Merge a feature branch into main.\n2) If needed, git add .\n3) git commit -m \"Resolve merge\" (or let merge commit complete)\n4) git status",
      hints: ["Unmerged paths show in status until you add them."],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ngit checkout -b other\ntouch other.txt\ngit add .\ngit commit -m "Other"\ngit switch main\ngit merge other\ngit status',
      takeaways: ["Conflict finish: edit → add → commit."],
      validateIncludes: ["git merge"],
    },
    {
      title: "Merge calmly under pressure",
      minutes: 22,
      kind: "debug",
      scenario:
        "Two branches contain related work. Combine them without panicking.",
      task: "1) Create two branches and commit on each.\n2) Switch to main.\n3) git merge one feature.\n4) Confirm with git log.",
      hints: [
        "Commit on both branches before merging.",
        "Verify with status/log after combining.",
      ],
      referenceSolution:
        "git checkout -b feature-a\n(commit)\ngit checkout main\ngit checkout -b feature-b\n(commit)\ngit checkout main\ngit merge feature-a\ngit log",
      takeaways: [
        "Merges are normal — panic is optional.",
        "Evidence after merge is mandatory.",
      ],
      validateIncludes: ["git merge"],
    }
  ),

  "recover-lost-commits": trio(
    {
      title: "Generate history worth recovering",
      minutes: 10,
      kind: "git",
      scenario:
        "Recovery needs history. Make commits you could find later.",
      task: "1) Make two commits.\n2) git log\n3) git reflog",
      hints: ["reflog tracks HEAD even when branches move."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "A"\ntouch b.txt\ngit add .\ngit commit -m "B"\ngit log\ngit reflog',
      takeaways: ["You can only recover what Git recorded."],
      validateIncludes: ["git reflog"],
    },
    {
      title: "Find HEAD positions in reflog",
      minutes: 14,
      kind: "recovery",
      scenario:
        "You switched branches and feel lost. reflog shows the trail.",
      task: "1) Commit on main.\n2) Create a branch, commit, switch back.\n3) git reflog and identify recent HEAD entries.",
      hints: ["Look for commit and checkout lines in reflog."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "A"\ngit checkout -b temp\ntouch t.txt\ngit add .\ngit commit -m "Temp"\ngit switch main\ngit reflog',
      takeaways: ["reflog is the map after detours."],
      validateIncludes: ["git reflog"],
    },
    {
      title: "Recover without panic",
      minutes: 22,
      kind: "recovery",
      scenario:
        "You think you lost work. Stay calm — start with history tools, not re-cloning.",
      task: "1) Make at least one commit.\n2) Run git reflog and read entries.\n3) Optionally practice git stash if you have dirty changes.",
      hints: [
        "On real Git you can recreate a branch from a reflog hash.",
        "Do not re-clone as your first move.",
      ],
      referenceSolution:
        'git commit -m "Safe point"\ngit reflog\n(optional) git stash\ngit stash list',
      takeaways: [
        "reflog is the first recovery tool.",
        "Calm orientation beats destructive guesses.",
      ],
      validateIncludes: ["git reflog"],
    }
  ),

  "fix-broken-repo": trio(
    {
      title: "Debug opener: status + remote",
      minutes: 10,
      kind: "debug",
      scenario:
        "Something feels wrong with the repo. Professionals open with status and remotes.",
      task: "1) git status\n2) git remote -v (add a remote first if none)\n3) pwd",
      hints: ["Collect facts before changing anything."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/you/app.git\ngit status\ngit remote -v\npwd',
      takeaways: ["status → remote -v is the broken-repo opener."],
      validateIncludes: ["git status"],
    },
    {
      title: "Clear a blocking dirty tree with stash",
      minutes: 14,
      kind: "debug",
      scenario:
        "You cannot switch branches because of dirty files. Stash to unblock.",
      task: "1) Create dirty work.\n2) git stash\n3) git status should be clean enough to continue.",
      hints: ["Dirty trees block many Git moves — stash or commit."],
      referenceSolution:
        'git init\ntouch base.txt\ngit add .\ngit commit -m "Base"\ntouch mess.txt\ngit stash\ngit status',
      takeaways: ["Unblock by preserving work, not deleting it."],
      validateIncludes: ["git stash"],
    },
    {
      title: "Systematic repair checklist",
      minutes: 20,
      kind: "scenario",
      scenario:
        "Run a full orientation checklist like a senior on-call.",
      task: "1) pwd + ls\n2) git status\n3) git remote -v\n4) git log\n5) Fix one thing (e.g. add remote or stash) and re-check status.",
      hints: ["Change one variable at a time."],
      referenceSolution:
        'pwd\nls\ngit status\ngit remote -v\ngit log\ngit stash\ngit status',
      takeaways: ["Systematic beats random command spam."],
      validateIncludes: ["git status"],
    }
  ),

  "company-branching-model": trio(
    {
      title: "Name a short fix branch",
      minutes: 8,
      kind: "git",
      scenario:
        "Company style: short-lived branches with clear names like fix/…",
      task: "1) Seed main.\n2) git switch -c fix/navbar-overflow\n3) git status",
      hints: ["fix/ and feature/ prefixes communicate intent."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Main"\ngit switch -c fix/navbar-overflow\ngit status',
      takeaways: ["Naming is part of the branching model."],
      validateIncludes: ["fix/"],
    },
    {
      title: "Keep main deployable",
      minutes: 14,
      kind: "git",
      scenario:
        "Do the work on a branch; leave main untouched until merge.",
      task: "1) Create fix/typo branch.\n2) Commit a change there.\n3) Switch back to main and git status / git log — main should not include the fix commit yet.",
      hints: ["Main stays clean until reviewed merge."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Main"\ngit switch -c fix/typo\ntouch typo.txt\ngit add .\ngit commit -m "Fix typo"\ngit switch main\ngit log',
      takeaways: ["Protected main stays deployable."],
      validateIncludes: ["git switch"],
    },
    {
      title: "Integrate a short-lived branch",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Trunk-based style: merge small branches often.",
      task: "1) Finish a fix/ branch with a commit.\n2) Merge into main.\n3) git log shows the integration.",
      hints: ["Small branches merge easier than week-long ones."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Main"\ngit switch -c fix/navbar-overflow\ntouch nav.txt\ngit add .\ngit commit -m "Fix overflow"\ngit switch main\ngit merge fix/navbar-overflow\ngit log',
      takeaways: ["Short branches + frequent merge = company default."],
      validateIncludes: ["git merge"],
    }
  ),

  "ship-with-confidence": trio(
    {
      title: "Tag what you intend to ship",
      minutes: 8,
      kind: "git",
      scenario:
        "Shipping confidence starts by labeling the commit you believe is good.",
      task: "1) Make a release commit.\n2) git tag v1.0.0\n3) git log",
      hints: ["Tags mark known-good release points."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Ship ready"\ngit tag v1.0.0\ngit log',
      takeaways: ["Tag the commit you verified."],
      validateIncludes: ["git tag"],
    },
    {
      title: "Verify history after merge",
      minutes: 14,
      kind: "git",
      scenario:
        "After merge, prove what shipped with log — do not disappear.",
      task: "1) Merge a feature into main.\n2) git log\n3) git status",
      hints: ["Verification is part of shipping."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Main"\ngit checkout -b feature/ship\ntouch ship.txt\ngit add .\ngit commit -m "Ship feature"\ngit switch main\ngit merge feature/ship\ngit log\ngit status',
      takeaways: ["Merge is not the end — verify the ship."],
      validateIncludes: ["git log"],
    },
    {
      title: "Release marker after a clean status",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Only tag when status is clean and log looks right.",
      task: "1) Ensure clean git status.\n2) git tag v1.2.0\n3) git log to confirm the tip you tagged.",
      hints: ["Dirty trees should not become release tags."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Ready"\ngit status\ngit tag v1.2.0\ngit log',
      takeaways: ["Clean → tag → watch production."],
      validateIncludes: ["git tag"],
    }
  ),

  "common-errors": trio(
    {
      title: "First response to any error: status",
      minutes: 8,
      kind: "debug",
      scenario:
        "Whatever the error text says, orientation comes first.",
      task: "1) git status\n2) pwd\n3) ls",
      hints: ["Read the error, then collect state."],
      referenceSolution: "git init\ngit status\npwd\nls",
      takeaways: ["Troubleshooting starts with orientation."],
      validateIncludes: ["git status"],
    },
    {
      title: "Fix diverged publish: pull then push",
      minutes: 14,
      kind: "debug",
      scenario:
        "Push rejected because remote is ahead. Practice pull then push.",
      task: "1) Add origin and commit locally.\n2) git pull\n3) git push",
      hints: ["non-fast-forward usually means pull/rebase before push."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Local"\ngit remote add origin https://github.com/you/app.git\ngit pull\ngit push',
      takeaways: ["Integrate remote before forcing a push."],
      validateIncludes: ["git pull"],
    },
    {
      title: "Full error triage loop",
      minutes: 18,
      kind: "scenario",
      scenario:
        "Run the professional triage: status → remote → pull/push.",
      task: "1) git status\n2) git remote -v\n3) git pull\n4) git push",
      hints: ["Copy the full error in real life; here practice the command loop."],
      referenceSolution:
        'git init\ntouch README.md\ngit add .\ngit commit -m "Init"\ngit remote add origin https://github.com/you/app.git\ngit status\ngit remote -v\ngit pull\ngit push',
      takeaways: ["Read → status → remote → integrate → retry."],
      validateIncludes: ["git status"],
    }
  ),

  "terminal-cheatsheet": trio(
    {
      title: "Drill navigation commands",
      minutes: 8,
      kind: "terminal",
      scenario:
        "Cheat sheets only help if your fingers know the commands.",
      task: "1) pwd\n2) ls\n3) cd projects\n4) pwd",
      hints: ["Do not just read — execute."],
      referenceSolution: "pwd\nls\ncd projects\npwd",
      takeaways: ["Practice turns a cheat sheet into muscle memory."],
      validateIncludes: ["ls"],
    },
    {
      title: "Drill create + inspect",
      minutes: 12,
      kind: "terminal",
      scenario:
        "Create, then prove with listing and reading.",
      task: "1) mkdir drills\n2) touch drills/item.txt\n3) ls drills\n4) cat drills/item.txt (empty is fine)",
      hints: ["Create → list → read is the inspect loop."],
      referenceSolution:
        "mkdir drills\ntouch drills/item.txt\nls drills\ncat drills/item.txt",
      takeaways: ["Verify every create."],
      validateIncludes: ["touch"],
    },
    {
      title: "Speed round: navigate, create, search",
      minutes: 16,
      kind: "scenario",
      scenario:
        "Under time, run a compact sequence covering the cheat sheet pillars.",
      task: "1) pwd + ls\n2) mkdir tmp && touch tmp/a.txt\n3) grep or find toward notes\n4) End at a known pwd",
      hints: ["Keep commands short and verified."],
      referenceSolution:
        "pwd\nls\nmkdir tmp\ntouch tmp/a.txt\nfind . -name notes\npwd",
      takeaways: ["Cheat sheet mastery is sequenced speed."],
      validateIncludes: ["find"],
    }
  ),

  "git-cheatsheet": trio(
    {
      title: "Core loop: status add commit",
      minutes: 8,
      kind: "git",
      scenario:
        "The everyday Git loop must be automatic.",
      task: "1) git status\n2) touch note.txt\n3) git add note.txt\n4) git commit -m \"Add note\"\n5) git status",
      hints: ["status brackets every change."],
      referenceSolution:
        'git init\ngit status\ntouch note.txt\ngit add note.txt\ngit commit -m "Add note"\ngit status',
      takeaways: ["status → add → commit → status."],
      validateIncludes: ["git commit"],
    },
    {
      title: "Branch loop from the cheat sheet",
      minutes: 12,
      kind: "git",
      scenario:
        "Practice branch / switch / merge from the sheet.",
      task: "1) git branch feature-sheet\n2) git switch feature-sheet\n3) commit once\n4) switch main and merge",
      hints: ["List branches if you forget names."],
      referenceSolution:
        'git init\ntouch seed.txt\ngit add .\ngit commit -m "Seed"\ngit branch feature-sheet\ngit switch feature-sheet\ntouch f.txt\ngit add .\ngit commit -m "Feature"\ngit switch main\ngit merge feature-sheet',
      takeaways: ["Branch tools are a closed loop."],
      validateIncludes: ["git merge"],
    },
    {
      title: "Rescue tools: stash + reflog",
      minutes: 16,
      kind: "recovery",
      scenario:
        "Cheat sheet recovery corner — use both tools once.",
      task: "1) Make a commit.\n2) touch wip.txt and git stash\n3) git reflog",
      hints: ["Rescue tools only help if you practice before emergencies."],
      referenceSolution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "A"\ntouch wip.txt\ngit stash\ngit reflog',
      takeaways: ["stash and reflog belong in weekly practice."],
      validateIncludes: ["git reflog"],
    }
  ),

  "final-workflow-project": [
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
        'git checkout -b feature/home\ntouch home.txt\ngit add .\ngit commit -m "Add home scaffold"',
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
  ],
};

function fallbackSpecs(topicTitle: string): Spec[] {
  // Should rarely run — every curriculum topic has explicit specs above.
  return trio(
    {
      title: `${topicTitle}: first command practice`,
      minutes: 8,
      kind: "terminal",
      scenario: `Get oriented before applying ${topicTitle}.`,
      task: "1) pwd\n2) ls\n3) git status (init first if needed)",
      hints: ["Orient, then act."],
      referenceSolution: "pwd\nls\ngit init\ngit status",
      takeaways: ["Unique practice starts with orientation."],
      validateIncludes: ["pwd"],
    },
    {
      title: `${topicTitle}: apply in a small workflow`,
      minutes: 14,
      kind: "git",
      scenario: `Apply ${topicTitle} with a short verified workflow.`,
      task: "1) Make one meaningful change.\n2) Use git add/commit as needed.\n3) Prove with git status.",
      hints: ["Keep the change small and verifiable."],
      referenceSolution: 'git add .\ngit commit -m "Practice"\ngit status',
      takeaways: ["Medium work is a verified mini-workflow."],
      validateIncludes: ["git status"],
    },
    {
      title: `${topicTitle}: realistic pressure scenario`,
      minutes: 20,
      kind: "scenario",
      scenario: `Complete a realistic sequence for ${topicTitle} and leave evidence.`,
      task: "1) Plan three steps.\n2) Execute them.\n3) Finish with git log or git status.",
      hints: ["Evidence is part of finishing."],
      referenceSolution: "git status\ngit log",
      takeaways: ["Hard level means scenario + proof."],
      validateIncludes: ["git status"],
    }
  );
}

function specsForTopic(topicSlug: string, topicTitle: string): Spec[] {
  return TOPIC_SPECS[topicSlug] ?? fallbackSpecs(topicTitle);
}

function buildChallenge(
  topicSlug: string,
  topicTitle: string,
  spec: Spec
): ToolingChallenge {
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

export function listDeveloperToolingChallenges(
  topicSlug: string
): ToolingChallenge[] {
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
  return (
    list.find((c) => c.id === challengeId || c.lesson.id === challengeId) ??
    null
  );
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
