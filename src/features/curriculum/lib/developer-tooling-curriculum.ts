export type ToolingDifficulty = "beginner" | "intermediate" | "advanced";

export type ToolingCheatSheet = {
  summary: string;
  commands: Array<{ cmd: string; desc: string }>;
  shortcuts?: string[];
  commonErrors?: string[];
  recovery?: string[];
};

export type ToolingExample = {
  title: string;
  command: string;
  output: string;
};

export type ToolingPracticeTask = {
  id: string;
  prompt: string;
  /** Substring or exact command the learner should run (validated loosely) */
  expectCommandIncludes: string[];
  successMessage: string;
};

export type ToolingTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ToolingDifficulty;
  keywords: string[];
  explanation: string;
  diagram?: "filesystem" | "git-flow" | "remote" | "pr-flow" | "shells";
  examples: ToolingExample[];
  commonMistakes: string[];
  bestPractices: string[];
  cheatSheet: ToolingCheatSheet;
  practiceTasks: ToolingPracticeTask[];
};

export type ToolingSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ToolingTopicDef[];
};

function topic(
  partial: Omit<ToolingTopicDef, "cheatSheet"> & {
    cheatSheet?: Partial<ToolingCheatSheet> & { commands: ToolingCheatSheet["commands"] };
  }
): ToolingTopicDef {
  return {
    ...partial,
    cheatSheet: {
      summary: partial.cheatSheet?.summary ?? partial.summary,
      commands: partial.cheatSheet?.commands ?? [],
      shortcuts: partial.cheatSheet?.shortcuts,
      commonErrors: partial.cheatSheet?.commonErrors,
      recovery: partial.cheatSheet?.recovery,
    },
  };
}

export const DEVELOPER_TOOLING_SECTIONS: ToolingSectionDef[] = [
  {
    slug: "terminal-fundamentals",
    title: "Terminal Fundamentals",
    description: "Master the shell so every other developer tool feels natural.",
    topics: [
      topic({
        slug: "what-is-terminal",
        title: "What is the Terminal?",
        summary: "A text interface to control your computer precisely and repeatably.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["terminal", "shell", "cli", "command line"],
        diagram: "shells",
        explanation: `The **terminal** is a window where you type commands. The **shell** (Bash, Zsh, PowerShell, CMD) reads those commands and tells the operating system what to do.

Developers use the terminal because it is:
- **Fast** — rename 200 files in one line
- **Scriptable** — automate builds, deploys, checks
- **Universal** — servers, CI, Docker, and Git all speak CLI

In SupraLearn you practice in a safe **simulated terminal**. Same commands, zero risk to your real machine.`,
        examples: [
          {
            title: "See where you are",
            command: "pwd",
            output: "/home/student",
          },
          {
            title: "List files",
            command: "ls",
            output: "notes.txt  projects",
          },
        ],
        commonMistakes: [
          "Confusing the terminal window with the shell language inside it",
          "Fear of typing — the academy terminal cannot break your PC",
        ],
        bestPractices: [
          "Read the prompt; know your current folder before deleting",
          "Prefer tab-completion and history (↑) once you leave the simulator",
        ],
        cheatSheet: {
          summary: "Terminal = window, shell = language that runs commands.",
          commands: [
            { cmd: "pwd", desc: "Print working directory" },
            { cmd: "ls", desc: "List files" },
            { cmd: "help", desc: "Academy command list" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Print your current directory.",
            expectCommandIncludes: ["pwd"],
            successMessage: "You know where you are — foundation of every workflow.",
          },
        ],
      }),
      topic({
        slug: "shells-compared",
        title: "CMD vs PowerShell vs Bash vs Zsh",
        summary: "Know which shell you are in — syntax differs.",
        estimatedMinutes: 15,
        difficulty: "beginner",
        keywords: ["cmd", "powershell", "bash", "zsh", "shell"],
        diagram: "shells",
        explanation: `**CMD** — legacy Windows shell. Limited for modern workflows.
**PowerShell** — powerful Windows shell with different syntax (\`Get-ChildItem\` vs \`ls\`).
**Bash** — default on many Linux servers and Git Bash on Windows.
**Zsh** — Bash-like, popular on macOS (Oh My Zsh).

SupraLearn uses **Bash-style** commands so your skills transfer to GitHub Actions, Linux servers, and most tutorials.`,
        examples: [
          {
            title: "Same idea, different shells",
            command: "ls",
            output: "# Bash/Zsh/Git Bash\n# PowerShell often aliases ls → Get-ChildItem",
          },
        ],
        commonMistakes: [
          "Copying PowerShell commands into Bash (or the reverse)",
          "Assuming Windows CMD can run Linux deploy scripts",
        ],
        bestPractices: [
          "Learn Bash deeply once — it is the industry lingua franca",
          "On Windows, use Git Bash or WSL for this module’s habits",
        ],
        cheatSheet: {
          summary: "SupraLearn = Bash-style. Servers and CI usually speak Bash too.",
          commands: [
            { cmd: "echo $SHELL", desc: "Show shell (real machines)" },
            { cmd: "whoami", desc: "Current user" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Print the current user with whoami.",
            expectCommandIncludes: ["whoami"],
            successMessage: "Shell identity checked.",
          },
        ],
      }),
      topic({
        slug: "file-system-basics",
        title: "The File System",
        summary: "Folders, paths, and why absolute vs relative paths matter.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["filesystem", "path", "directory", "folder"],
        diagram: "filesystem",
        explanation: `Everything lives in a tree. \`/\` is the root. Your home folder is usually \`/home/student\` in this academy.

- **Absolute path** — starts with \`/\` (or \`C:\\\` on Windows)
- **Relative path** — from your current directory (\`.\`, \`..\`, \`projects\`)

Almost every bug beginners hit with Git or Node starts with “I was in the wrong folder.”`,
        examples: [
          {
            title: "Absolute vs relative",
            command: "cd /home/student/projects",
            output: "(moves using absolute path)",
          },
        ],
        commonMistakes: [
          "Using spaces in paths without quotes",
          "Assuming Desktop paths are the same on every OS",
        ],
        bestPractices: [
          "Keep project folders under one parent (e.g. ~/projects)",
          "Prefer forward slashes in docs — they work in Git Bash too",
        ],
        cheatSheet: {
          summary: "Always know cwd (pwd) before destructive commands.",
          commands: [
            { cmd: "pwd", desc: "Where am I?" },
            { cmd: "cd ..", desc: "Go up one directory" },
            { cmd: "cd ~", desc: "Go home" },
          ],
          commonErrors: ["No such file or directory → wrong path or cwd"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Change into the projects folder under your home.",
            expectCommandIncludes: ["cd", "projects"],
            successMessage: "Navigation locked in.",
          },
        ],
      }),
      topic({
        slug: "pwd-ls-cd",
        title: "pwd, ls, and cd",
        summary: "The three commands you will use hundreds of times a day.",
        estimatedMinutes: 18,
        difficulty: "beginner",
        keywords: ["pwd", "ls", "cd", "navigation"],
        explanation: `**pwd** — print working directory  
**ls** — list contents (\`-a\` includes hidden)  
**cd** — change directory

Muscle memory goal: move anywhere without touching the mouse.`,
        examples: [
          { title: "List", command: "ls -a", output: "notes.txt  projects" },
          { title: "Move", command: "cd projects", output: "" },
        ],
        commonMistakes: [
          "cd into a file",
          "Forgetting you already changed directories",
        ],
        bestPractices: ["ls after cd to confirm", "Use cd - on real shells to jump back"],
        cheatSheet: {
          summary: "Orient (pwd) → inspect (ls) → move (cd).",
          commands: [
            { cmd: "pwd", desc: "Current path" },
            { cmd: "ls", desc: "List" },
            { cmd: "ls -a", desc: "Include hidden" },
            { cmd: "cd <dir>", desc: "Enter directory" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run pwd, then ls, then cd into projects.",
            expectCommandIncludes: ["cd"],
            successMessage: "Core navigation loop complete.",
          },
        ],
      }),
      topic({
        slug: "mkdir-touch",
        title: "mkdir and touch",
        summary: "Create folders and empty files from the keyboard.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["mkdir", "touch", "create"],
        explanation: `**mkdir** creates directories. **touch** creates empty files (or updates timestamps).

Real workflow: \`mkdir app && cd app && touch README.md\`.`,
        examples: [
          { title: "Create folder", command: "mkdir demo", output: "" },
          { title: "Create file", command: "touch demo/app.js", output: "" },
        ],
        commonMistakes: ["mkdir when a file with that name exists"],
        bestPractices: ["Create a clear folder per project", "Always add a README early"],
        cheatSheet: {
          summary: "Scaffold structure before writing code.",
          commands: [
            { cmd: "mkdir <name>", desc: "Create directory" },
            { cmd: "touch <file>", desc: "Create empty file" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create a folder called lab and a file lab/hello.txt.",
            expectCommandIncludes: ["mkdir"],
            successMessage: "You can scaffold a project tree.",
          },
        ],
      }),
      topic({
        slug: "cp-mv-rm",
        title: "cp, mv, and rm",
        summary: "Copy, rename/move, and delete — carefully.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["cp", "mv", "rm", "delete"],
        explanation: `**cp** copies files. **mv** moves or renames. **rm** deletes (\`-r\` for directories).

\`rm\` is permanent in real terminals. In this academy you are safe — still practice the habit of checking \`ls\` and \`pwd\` first.`,
        examples: [
          { title: "Copy", command: "cp notes.txt notes.bak", output: "" },
          { title: "Rename", command: "mv notes.bak backup.txt", output: "" },
        ],
        commonMistakes: ["rm -rf / or wrong folder", "mv overwriting without noticing"],
        bestPractices: ["Prefer trash tools in GUI for huge deletes", "Double-check paths"],
        cheatSheet: {
          summary: "Destructive commands need a second look.",
          commands: [
            { cmd: "cp <src> <dest>", desc: "Copy file" },
            { cmd: "mv <src> <dest>", desc: "Move/rename" },
            { cmd: "rm <file>", desc: "Delete file" },
            { cmd: "rm -r <dir>", desc: "Delete directory" },
          ],
          recovery: ["Real OS: recover from backups/Time Machine — not from rm"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Copy notes.txt to notes-copy.txt",
            expectCommandIncludes: ["cp", "notes"],
            successMessage: "Copy/move skills unlocked.",
          },
        ],
      }),
      topic({
        slug: "cat-clear-history",
        title: "cat, clear, and history",
        summary: "Read files, clean the screen, and replay past commands.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["cat", "clear", "history"],
        explanation: `**cat** prints file contents. **clear** clears the screen. **history** lists recent commands.

Pros live in history — never retype long commands.`,
        examples: [
          { title: "Read", command: "cat notes.txt", output: "Welcome to the SupraLearn terminal." },
        ],
        commonMistakes: ["cat on huge files (use less/head on real systems)"],
        bestPractices: ["clear when the screen gets noisy", "Search history with Ctrl+R on real shells"],
        cheatSheet: {
          summary: "Read → clear → reuse.",
          commands: [
            { cmd: "cat <file>", desc: "Print file" },
            { cmd: "clear", desc: "Clear screen" },
            { cmd: "history", desc: "Past commands" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Display notes.txt with cat.",
            expectCommandIncludes: ["cat", "notes"],
            successMessage: "You can inspect file contents from the shell.",
          },
        ],
      }),
      topic({
        slug: "find-grep",
        title: "find and grep",
        summary: "Search the filesystem and search inside files.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["find", "grep", "search"],
        explanation: `**find** locates files by name/path. **grep** finds lines matching a pattern inside a file.

Together they replace hours of manual clicking.`,
        examples: [
          { title: "Find by name", command: "find . -name notes", output: "/home/student/notes.txt" },
          { title: "Search content", command: "grep Welcome notes.txt", output: "Welcome to the SupraLearn terminal." },
        ],
        commonMistakes: ["Wrong cwd so find returns nothing"],
        bestPractices: ["Start find from the project root", "Combine with Git later for code search"],
        cheatSheet: {
          summary: "find = files, grep = lines.",
          commands: [
            { cmd: "find . -name <part>", desc: "Find files" },
            { cmd: "grep <text> <file>", desc: "Search in file" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "grep for Welcome inside notes.txt",
            expectCommandIncludes: ["grep", "Welcome"],
            successMessage: "Search skills online.",
          },
        ],
      }),
      topic({
        slug: "env-and-path",
        title: "Environment Variables & PATH",
        summary: "How the shell finds programs and stores config.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["env", "path", "export", "environment"],
        explanation: `**Environment variables** are key/value settings available to programs (\`HOME\`, \`PATH\`, \`NODE_ENV\`).

**PATH** is a list of folders the shell searches when you type a command. If a tool “isn’t found”, PATH is usually wrong.

Use \`export NAME=value\` in a session; real machines persist via \`.bashrc\` / \`.zshrc\`.`,
        examples: [
          { title: "Show PATH", command: "echo $PATH", output: "/usr/local/bin:/usr/bin:/bin" },
          { title: "Set var", command: "export COURSE=tooling", output: "" },
        ],
        commonMistakes: ["Installing a tool but not updating PATH", "Committing secrets in env files"],
        bestPractices: ["Never commit .env with secrets", "Understand PATH before debugging 'command not found'"],
        cheatSheet: {
          summary: "env configures programs; PATH finds executables.",
          commands: [
            { cmd: "env", desc: "List variables" },
            { cmd: "export A=b", desc: "Set variable" },
            { cmd: "echo $PATH", desc: "Print PATH" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "export LEARN=supralearn then echo $LEARN",
            expectCommandIncludes: ["export"],
            successMessage: "You can shape the shell environment.",
          },
        ],
      }),
      topic({
        slug: "permissions-basics",
        title: "Permissions Basics",
        summary: "Read, write, execute — why permission denied happens.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["permissions", "chmod", "sudo"],
        explanation: `Files have permission bits for user/group/other: read, write, execute.

Beginners hit \`Permission denied\` when:
- Running a script without execute permission
- Writing to system folders
- Using the wrong user

This academy focuses on recognition and safe habits. On real Linux you will use \`chmod\`, \`chown\`, and only rarely \`sudo\`.`,
        examples: [
          {
            title: "Mental model",
            command: "ls",
            output: "# rwx r-x r-x → owner can edit; others can run/read",
          },
        ],
        commonMistakes: ["sudo for everything", "chmod 777 on production"],
        bestPractices: ["Fix ownership instead of opening permissions wide", "Scripts: chmod +x only when needed"],
        cheatSheet: {
          summary: "Permission denied → wrong user or missing mode — not a mystery.",
          commands: [
            { cmd: "ls -l", desc: "Show permissions (real shells)" },
            { cmd: "chmod +x script.sh", desc: "Make executable (real)" },
          ],
          commonErrors: ["Permission denied", "Operation not permitted"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run help and skim supported commands (permissions are conceptual here).",
            expectCommandIncludes: ["help"],
            successMessage: "You know where permissions fit in the toolchain.",
          },
        ],
      }),
    ],
  },
  {
    slug: "git-fundamentals",
    title: "Git Fundamentals",
    description: "From zero to confident: repositories, commits, branches, and history.",
    topics: [
      topic({
        slug: "what-is-git",
        title: "What is Git?",
        summary: "Distributed version control — snapshots of your project over time.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["git", "version control", "vcs"],
        diagram: "git-flow",
        explanation: `**Git** records snapshots (commits) of your project. You can travel in time, branch ideas safely, and collaborate without overwriting each other.

Git ≠ GitHub. Git is the tool on your machine. GitHub hosts remotes and collaboration UI.`,
        examples: [
          { title: "Start a repo", command: "git init", output: "Initialized empty Git repository in .git/" },
        ],
        commonMistakes: ["Thinking Git requires internet", "Mixing Git concepts with GitHub buttons only"],
        bestPractices: ["Init Git at the project root", "Commit small, meaningful chunks"],
        cheatSheet: {
          summary: "Git = local history engine.",
          commands: [
            { cmd: "git init", desc: "Create repository" },
            { cmd: "git status", desc: "What changed?" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Initialize a Git repository in your current folder.",
            expectCommandIncludes: ["git init"],
            successMessage: "Repository born.",
          },
        ],
      }),
      topic({
        slug: "why-git-exists",
        title: "Why Git Exists",
        summary: "The pain Git solves: lost work, collisions, and “which zip is final”.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["why git", "history", "collaboration"],
        explanation: `Before Git, teams emailed \`project-final-v3-REAL.zip\`. People overwrote work. Nobody knew what changed.

Git gives:
1. History you can audit
2. Branches for parallel work
3. Merge tools for combining work
4. Remotes for backup and collaboration`,
        examples: [
          { title: "See status early", command: "git status", output: "fatal: not a git repository (until you init)" },
        ],
        commonMistakes: ["Huge rare commits instead of small frequent ones"],
        bestPractices: ["Commit when a unit of work makes sense", "Write messages for future you"],
        cheatSheet: {
          summary: "Git replaces final.zip chaos with history.",
          commands: [{ cmd: "git status", desc: "Orient yourself" }],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run git status (init first if needed).",
            expectCommandIncludes: ["git status"],
            successMessage: "You use status as a compass.",
          },
        ],
      }),
      topic({
        slug: "repo-staging-commit",
        title: "Repo, Working Tree, Staging, Commit",
        summary: "The four boxes every Git command moves files between.",
        estimatedMinutes: 20,
        difficulty: "beginner",
        keywords: ["staging", "commit", "working tree", "index"],
        diagram: "git-flow",
        explanation: `1. **Working tree** — files you edit  
2. **Staging area (index)** — what will go into the next commit (\`git add\`)  
3. **Local repository** — committed snapshots (\`git commit\`)  
4. **Remote** — GitHub copy (\`git push\`) — later section

Visualize: edit → add → commit → push.`,
        examples: [
          { title: "Track a file", command: "git add notes.txt", output: "" },
          { title: "Commit", command: "git commit -m \"Add notes\"", output: "[main abc1234] Add notes" },
        ],
        commonMistakes: ["commit without add", "Vague messages like 'update'"],
        bestPractices: ["Stage intentionally", "One logical change per commit"],
        cheatSheet: {
          summary: "Working → Staging → Local repo.",
          commands: [
            { cmd: "git status", desc: "See all three areas" },
            { cmd: "git add <file>", desc: "Stage" },
            { cmd: "git add .", desc: "Stage all" },
            { cmd: "git commit -m \"msg\"", desc: "Snapshot" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Init, create a file, add it, and commit with a message.",
            expectCommandIncludes: ["git commit"],
            successMessage: "You completed the core Git loop.",
          },
        ],
      }),
      topic({
        slug: "branches-and-head",
        title: "Branches, HEAD, and Tags",
        summary: "Parallel lines of history and pointers to commits.",
        estimatedMinutes: 18,
        difficulty: "beginner",
        keywords: ["branch", "head", "tag", "checkout", "switch"],
        diagram: "git-flow",
        explanation: `A **branch** is a movable pointer to a commit. **HEAD** points to your current branch (or commit).

**Tags** mark releases (\`v1.0.0\`) — fixed pointers.

Create feature branches for every non-trivial change. Never invent on \`main\` in team settings.`,
        examples: [
          { title: "Create branch", command: "git branch feature-login", output: "" },
          { title: "Switch", command: "git switch feature-login", output: "Switched to branch 'feature-login'" },
        ],
        commonMistakes: ["Committing to main by accident", "Long-lived branches that never merge"],
        bestPractices: ["Branch names: feature/…, fix/…", "Delete branches after merge"],
        cheatSheet: {
          summary: "Branch = pointer. HEAD = you are here.",
          commands: [
            { cmd: "git branch", desc: "List branches" },
            { cmd: "git branch <name>", desc: "Create" },
            { cmd: "git switch <name>", desc: "Move HEAD" },
            { cmd: "git checkout -b <name>", desc: "Create + switch" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create and switch to a branch named practice-branch.",
            expectCommandIncludes: ["practice-branch"],
            successMessage: "Branching under control.",
          },
        ],
      }),
      topic({
        slug: "diff-log-history",
        title: "diff, log, and History",
        summary: "Inspect what changed and walk the commit timeline.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["diff", "log", "history"],
        explanation: `**git log** shows commits. **git diff** shows patch details.

Read history before you reset or rebase. Professionals diagnose with log/diff first.`,
        examples: [
          { title: "History", command: "git log", output: "commit abc…\n    Add notes" },
        ],
        commonMistakes: ["Rewriting history you already pushed without team agreement"],
        bestPractices: ["Read log before merge conflicts panic", "Keep commit messages searchable"],
        cheatSheet: {
          summary: "log = timeline, diff = details.",
          commands: [
            { cmd: "git log", desc: "Commit history" },
            { cmd: "git diff", desc: "Unstaged changes" },
            { cmd: "git status", desc: "Quick overview" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "After at least one commit, run git log.",
            expectCommandIncludes: ["git log"],
            successMessage: "You can read project history.",
          },
        ],
      }),
      topic({
        slug: "reset-checkout-restore",
        title: "reset, checkout, and restore",
        summary: "Undo safely — know which command moves what.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["reset", "restore", "checkout", "undo"],
        explanation: `**git restore** — discard or unstage working tree changes (modern).  
**git reset** — move branch pointer / unstage (\`--soft\`, \`--mixed\`, \`--hard\`).  
**git checkout** — older switch/restore combo (still common).

Hard reset can delete uncommitted work. Prefer restore + soft reset until you are confident.`,
        examples: [
          { title: "Unstage all", command: "git reset", output: "staging area cleared (simplified simulator)" },
        ],
        commonMistakes: ["reset --hard without checking status", "Confusing restore with delete forever"],
        bestPractices: ["status → plan → undo", "Use stash if you might need changes later"],
        cheatSheet: {
          summary: "Undo with intent; hard reset is last resort.",
          commands: [
            { cmd: "git restore <file>", desc: "Discard WT changes (real)" },
            { cmd: "git reset", desc: "Unstage" },
            { cmd: "git stash", desc: "Shelve work" },
          ],
          recovery: ["reflog can find lost commits on real Git"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Stage something then run git reset to unstage.",
            expectCommandIncludes: ["git reset"],
            successMessage: "You can reverse staging safely.",
          },
        ],
      }),
      topic({
        slug: "merge-rebase-cherry",
        title: "merge, rebase, and cherry-pick",
        summary: "Combine histories — and when to use each.",
        estimatedMinutes: 22,
        difficulty: "intermediate",
        keywords: ["merge", "rebase", "cherry-pick"],
        diagram: "git-flow",
        explanation: `**merge** — joins branches; preserves history; creates merge commits.  
**rebase** — replays commits on another base; linear history; rewrite carefully.  
**cherry-pick** — copy a single commit onto your branch.

Teams often: feature branches + merge via Pull Request. Rebase for cleaning local commits before sharing.`,
        examples: [
          { title: "Merge", command: "git merge feature-login", output: "Merge made by the 'ort' strategy." },
        ],
        commonMistakes: ["Rebasing commits already on shared main", "Giant merges with no review"],
        bestPractices: ["Prefer PR merges at work", "Rebase only local commits you own"],
        cheatSheet: {
          summary: "merge = join, rebase = replay, cherry-pick = one commit.",
          commands: [
            { cmd: "git merge <branch>", desc: "Merge into current" },
            { cmd: "git rebase <branch>", desc: "Replay (advanced)" },
            { cmd: "git cherry-pick <hash>", desc: "Copy one commit" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create two branches with commits, then merge one into the other.",
            expectCommandIncludes: ["git merge"],
            successMessage: "You combined histories on purpose.",
          },
        ],
      }),
      topic({
        slug: "stash-and-reflog",
        title: "stash and reflog",
        summary: "Shelve work and recover “lost” commits.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["stash", "reflog", "recover"],
        explanation: `**stash** temporarily shelves dirty work so you can switch branches.  
**reflog** records where HEAD has been — lifesaver after bad resets.

Job-ready developers recover calmly instead of re-cloning in panic.`,
        examples: [
          { title: "Stash", command: "git stash", output: "Saved working directory and index state WIP" },
          { title: "List", command: "git stash list", output: "stash@{0}: WIP on main" },
        ],
        commonMistakes: ["Forgetting stashes exist", "Ignoring reflog after a mistake"],
        bestPractices: ["stash pop when ready", "Check reflog before rewriting again"],
        cheatSheet: {
          summary: "stash = pocket; reflog = time machine for HEAD.",
          commands: [
            { cmd: "git stash", desc: "Shelve" },
            { cmd: "git stash list", desc: "Show stashes" },
            { cmd: "git stash pop", desc: "Apply + drop" },
            { cmd: "git reflog", desc: "HEAD history" },
          ],
          recovery: ["git reflog → checkout / reset to found hash"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Make a change, stash it, then list stashes.",
            expectCommandIncludes: ["git stash"],
            successMessage: "You can shelve and recover work.",
          },
        ],
      }),
    ],
  },
  {
    slug: "github-fundamentals",
    title: "GitHub Fundamentals",
    description: "Remotes, PRs, SSH, and the collaboration platform professionals use daily.",
    topics: [
      topic({
        slug: "github-repos-clone-fork",
        title: "Repositories, Clone, and Fork",
        summary: "Hosted Git + how you get code onto your machine.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["github", "clone", "fork", "remote"],
        diagram: "remote",
        explanation: `A **GitHub repository** is a remote project home: code, issues, PRs, Actions.

**Clone** — copy a remote repo locally (\`git clone\`).  
**Fork** — your copy under your account (common for open source).  
**remote** — named URL pointer (\`origin\`).`,
        examples: [
          {
            title: "Add remote",
            command: "git remote add origin https://github.com/you/app.git",
            output: "",
          },
          { title: "Inspect", command: "git remote -v", output: "origin  https://github.com/you/app.git (fetch)" },
        ],
        commonMistakes: ["Cloning then editing the wrong folder", "Two remotes confused"],
        bestPractices: ["One project folder ↔ one origin", "Verify remote -v after setup"],
        cheatSheet: {
          summary: "Clone to start; remote connects push/pull.",
          commands: [
            { cmd: "git remote add origin <url>", desc: "Set origin" },
            { cmd: "git remote -v", desc: "Show remotes" },
            { cmd: "git push", desc: "Publish commits" },
            { cmd: "git pull", desc: "Fetch + merge" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Add a remote named origin with any https URL, then git remote -v.",
            expectCommandIncludes: ["git remote"],
            successMessage: "You can wire local repos to GitHub.",
          },
        ],
      }),
      topic({
        slug: "ssh-https-tokens",
        title: "SSH, HTTPS, and Access Tokens",
        summary: "Authenticate to GitHub securely.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["ssh", "https", "pat", "token", "deploy key"],
        explanation: `**HTTPS + Personal Access Token (PAT)** — password replaced by token.  
**SSH keys** — cryptographic login; preferred by many pros.  
**Deploy keys** — repo-scoped keys for servers.  
**Secrets** — CI encrypted values (never in code).

Security rule: treat tokens like passwords. Revoke if leaked.`,
        examples: [
          {
            title: "SSH remote style",
            command: "git remote add origin git@github.com:you/app.git",
            output: "",
          },
        ],
        commonMistakes: ["Committing tokens", "Emailing PATs", "Using account password for Git (deprecated)"],
        bestPractices: ["SSH for daily work", "Least-privilege tokens", "Org SSO awareness"],
        cheatSheet: {
          summary: "SSH or PAT — never commit credentials.",
          commands: [
            { cmd: "ssh-keygen -t ed25519", desc: "Create key (real machine)" },
            { cmd: "git remote -v", desc: "Check URL scheme" },
          ],
          commonErrors: ["Permission denied (publickey)", "Authentication failed"],
          recovery: ["Regenerate key/token; update GitHub settings"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Add an SSH-style origin remote URL and verify with remote -v.",
            expectCommandIncludes: ["git@github.com"],
            successMessage: "You recognize secure remote URLs.",
          },
        ],
      }),
      topic({
        slug: "issues-actions-releases",
        title: "Issues, Actions, and Releases",
        summary: "Track work, automate CI, and ship versions.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["issues", "actions", "releases", "projects"],
        explanation: `**Issues** — bugs and tasks.  
**Projects** — boards.  
**Discussions / Wiki** — conversation and docs.  
**Actions** — CI/CD workflows on push/PR.  
**Releases** — versioned artifacts + notes.  
**Organizations** — shared ownership and teams.`,
        examples: [
          {
            title: "Mindset",
            command: "git log",
            output: "# Releases tag commits; Actions run on those commits",
          },
        ],
        commonMistakes: ["No issue → mystery PR", "Skipping CI failures"],
        bestPractices: ["Link PRs to issues", "Protect main with required checks"],
        cheatSheet: {
          summary: "Issues track; Actions verify; Releases ship.",
          commands: [{ cmd: "git tag v1.0.0", desc: "Mark a release point" }],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create a simulated tag v0.1.0 after a commit.",
            expectCommandIncludes: ["git tag"],
            successMessage: "You connected commits to release thinking.",
          },
        ],
      }),
      topic({
        slug: "collaborators-and-security",
        title: "Collaborators, Orgs, and Secrets",
        summary: "Who can push, and how teams keep credentials safe.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["collaborators", "org", "secrets", "security"],
        explanation: `Add **collaborators** for small repos; use **Organizations** + teams for companies.

Store API keys in **GitHub Secrets** / env managers — never in Git history.

Branch protection: require PR reviews before merge to main.`,
        examples: [
          {
            title: "Push after protection",
            command: "git push",
            output: "# May be rejected on real GitHub if PR required — that is good",
          },
        ],
        commonMistakes: ["Admin rights for everyone", "Secrets in README screenshots"],
        bestPractices: ["Least privilege", "Rotate secrets", "Audit access quarterly"],
        cheatSheet: {
          summary: "Access + secrets + protected main = professional baseline.",
          commands: [{ cmd: "git push", desc: "Publishes — only if allowed" }],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Push to origin after adding a remote (simulated success path).",
            expectCommandIncludes: ["git push"],
            successMessage: "You practiced the publish step teams gate with reviews.",
          },
        ],
      }),
    ],
  },
  {
    slug: "daily-developer-workflow",
    title: "Daily Developer Workflow",
    description: "The loop you will repeat at every job: branch, commit, push, PR.",
    topics: [
      topic({
        slug: "daily-loop",
        title: "The Daily Loop",
        summary: "pull → branch → code → commit → push → PR.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["workflow", "daily", "pull", "push", "pr"],
        diagram: "pr-flow",
        explanation: `Company morning routine:
1. \`git pull\` on main
2. \`git switch -c feature/x\`
3. Work + commit often
4. \`git push -u origin HEAD\`
5. Open Pull Request
6. Address review
7. Merge + delete branch

Memorize this until it is automatic.`,
        examples: [
          { title: "Feature branch", command: "git checkout -b feature/login", output: "Switched to a new branch 'feature/login'" },
        ],
        commonMistakes: ["Working on main", "One giant commit at Friday 5pm"],
        bestPractices: ["Pull before branching", "Push early for backup"],
        cheatSheet: {
          summary: "Branch → commit → push → PR → merge → delete.",
          commands: [
            { cmd: "git pull", desc: "Update local" },
            { cmd: "git checkout -b feature/x", desc: "Feature branch" },
            { cmd: "git push", desc: "Publish branch" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create branch feature/daily-loop and make a commit.",
            expectCommandIncludes: ["feature/daily-loop"],
            successMessage: "Daily loop muscle memory started.",
          },
        ],
      }),
      topic({
        slug: "scenario-login-page",
        title: "Scenario: CEO Asks for a Login Page",
        summary: "Run a realistic request through the full GitHub workflow.",
        estimatedMinutes: 20,
        difficulty: "intermediate",
        keywords: ["scenario", "pr", "login", "company"],
        diagram: "pr-flow",
        explanation: `Scenario: CEO asks for a login page.

1. Clarify acceptance criteria (from Programming Fundamentals habits)
2. Branch \`feature/login-page\`
3. Commit UI scaffold
4. Push + open PR “Add login page scaffold”
5. Reviewer requests change → commit → push
6. Merge to main
7. Delete branch

Repeat until boring — boring means job-ready.`,
        examples: [
          { title: "Branch", command: "git switch -c feature/login-page", output: "Switched to a new branch 'feature/login-page'" },
          { title: "Commit", command: "git commit -m \"Add login page scaffold\"", output: "[feature/login-page …] Add login page scaffold" },
        ],
        commonMistakes: ["PR with no description", "Merging your own PR without review in team settings"],
        bestPractices: ["PR template: why / screenshots / test plan", "Small PRs"],
        cheatSheet: {
          summary: "Every ask becomes a branch + PR.",
          commands: [
            { cmd: "git switch -c feature/login-page", desc: "Start work" },
            { cmd: "git commit -m \"…\"", desc: "Save progress" },
            { cmd: "git push", desc: "Share for review" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create feature/login-page, add a file, commit with message about login.",
            expectCommandIncludes: ["commit"],
            successMessage: "You simulated a company feature delivery.",
          },
        ],
      }),
    ],
  },
  {
    slug: "collaboration-workflow",
    title: "Collaboration Workflow",
    description: "Reviews, comments, and conflict resolution with teammates.",
    topics: [
      topic({
        slug: "pull-requests-review",
        title: "Pull Requests & Code Review",
        summary: "How teams discuss code before it hits main.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["pull request", "review", "collaboration"],
        diagram: "pr-flow",
        explanation: `A **Pull Request (PR)** proposes merging your branch. Reviewers comment, approve, or request changes.

Good PR:
- Clear title and why
- Small diff
- Screenshots / test notes
- Linked issue`,
        examples: [
          { title: "Publish branch", command: "git push", output: " * [new branch]      feature/x -> feature/x" },
        ],
        commonMistakes: ["Force-pushing after review without warning", "Ignoring CI"],
        bestPractices: ["Respond to every comment", "Thank reviewers"],
        cheatSheet: {
          summary: "PR is a conversation, not a dump.",
          commands: [{ cmd: "git push", desc: "Update PR commits" }],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Push a feature branch to origin (add remote first if needed).",
            expectCommandIncludes: ["git push"],
            successMessage: "You practiced the share-for-review step.",
          },
        ],
      }),
      topic({
        slug: "merge-conflicts",
        title: "Merge Conflicts",
        summary: "When two edits touch the same lines — resolve calmly.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["merge conflict", "conflict", "resolve"],
        explanation: `Conflicts happen when Git cannot auto-merge. Markers look like:

\`\`\`
<<<<<<< HEAD
your change
=======
their change
>>>>>>> branch
\`\`\`

Resolve by editing, then \`git add\` + commit (or continue rebase).

Prevention: pull often, small PRs, communicate ownership of files.`,
        examples: [
          { title: "After fixing files", command: "git add .", output: "" },
          { title: "Finish", command: "git commit -m \"Resolve merge conflict\"", output: "[main …] Resolve merge conflict" },
        ],
        commonMistakes: ["Deleting both sides blindly", "Leaving conflict markers in code"],
        bestPractices: ["Talk to the other author", "Run tests after resolve"],
        cheatSheet: {
          summary: "Edit markers → add → commit.",
          commands: [
            { cmd: "git status", desc: "See unmerged paths" },
            { cmd: "git add <file>", desc: "Mark resolved" },
            { cmd: "git commit", desc: "Complete merge" },
          ],
          recovery: ["Abort: git merge --abort (real Git)"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Merge a secondary branch into your current branch after commits on both.",
            expectCommandIncludes: ["git merge"],
            successMessage: "You practiced combining workstreams.",
          },
        ],
      }),
    ],
  },
  {
    slug: "advanced-git",
    title: "Advanced Git",
    description: "Recovery, rewriting, and power tools used by seniors.",
    topics: [
      topic({
        slug: "recover-lost-commits",
        title: "Recover Lost Commits & Deleted Branches",
        summary: "reflog-first recovery mindset for disasters.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["recover", "reflog", "deleted branch", "lost commit"],
        explanation: `Deleted a branch? Soft-reset too far? Start with **reflog**, find the hash, recreate the branch.

\`git branch rescue <hash>\`

Most “I lost everything” moments are recoverable within the reflog window.`,
        examples: [
          { title: "Inspect", command: "git reflog", output: "abc123 HEAD@{0}: commit: …" },
        ],
        commonMistakes: ["Re-cloning immediately", "force push without checking"],
        bestPractices: ["reflog → branch → verify → continue"],
        cheatSheet: {
          summary: "reflog is your parachute.",
          commands: [
            { cmd: "git reflog", desc: "Find lost HEAD positions" },
            { cmd: "git branch rescue <hash>", desc: "Restore pointer" },
          ],
          recovery: ["git fsck --lost-found on real systems for dangling commits"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Make commits then run git reflog.",
            expectCommandIncludes: ["git reflog"],
            successMessage: "Recovery instinct installed.",
          },
        ],
      }),
      topic({
        slug: "fix-broken-repo",
        title: "Fix a Broken Repository",
        summary: "Debugging detached HEAD, wrong remotes, and dirty trees.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["detached head", "broken", "debug", "troubleshooting"],
        explanation: `Symptoms → checks:
- Weird folder? \`pwd\` + \`ls\`
- Git confused? \`git status\`
- Wrong remote? \`git remote -v\`
- Detached HEAD? create branch from here
- Dirty tree blocking switch? stash or commit

Systematic debugging beats random commands.`,
        examples: [
          { title: "Orient", command: "git status", output: "On branch main" },
        ],
        commonMistakes: ["Running reset --hard as first reaction"],
        bestPractices: ["Write down the goal state", "Change one thing at a time"],
        cheatSheet: {
          summary: "status → remote -v → log → act.",
          commands: [
            { cmd: "git status", desc: "State" },
            { cmd: "git remote -v", desc: "Remotes" },
            { cmd: "git stash", desc: "Clear the way" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run git status and git remote -v as your debug opener.",
            expectCommandIncludes: ["git status"],
            successMessage: "You debug repos like a professional.",
          },
        ],
      }),
    ],
  },
  {
    slug: "real-company-workflow",
    title: "Real Company Workflow",
    description: "End-to-end habits that match how product teams ship.",
    topics: [
      topic({
        slug: "company-branching-model",
        title: "Company Branching Model",
        summary: "main protected, short feature branches, PR required.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["trunk", "gitflow", "protected branch", "company"],
        diagram: "pr-flow",
        explanation: `Modern default: **trunk-based** development — short-lived branches off \`main\`, frequent merges, CI on every PR.

Older **GitFlow** (develop/release/hotfix) still appears; know it exists, prefer simpler models unless the company mandates GitFlow.

Your job: match the team's written workflow doc on day one.`,
        examples: [
          { title: "Short branch", command: "git switch -c fix/navbar-overflow", output: "Switched to a new branch 'fix/navbar-overflow'" },
        ],
        commonMistakes: ["Week-long branches", "Direct commits to main"],
        bestPractices: ["Open draft PRs early", "Keep main deployable"],
        cheatSheet: {
          summary: "Short branches + protected main + CI.",
          commands: [
            { cmd: "git switch -c fix/…", desc: "Tiny focused branch" },
            { cmd: "git pull origin main", desc: "Stay current" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create a fix/ naming-branch and commit once.",
            expectCommandIncludes: ["fix/"],
            successMessage: "Company-style branch naming practiced.",
          },
        ],
      }),
      topic({
        slug: "ship-with-confidence",
        title: "Ship with Confidence",
        summary: "From PR merge to knowing production is safe.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["deploy", "ship", "ci", "release"],
        explanation: `After merge:
1. CI deploys or a release pipeline runs
2. You verify the feature
3. You watch errors/logs
4. You are ready to revert/fix-forward

Git skills + CI awareness = production confidence.`,
        examples: [
          { title: "Tag a ship", command: "git tag v1.2.0", output: "Annotated tag 'v1.2.0' recorded (simulated)" },
        ],
        commonMistakes: ["Merge and disappear", "No rollback plan"],
        bestPractices: ["Verify after deploy", "Know revert vs forward-fix"],
        cheatSheet: {
          summary: "Merge is not the end — verify the ship.",
          commands: [
            { cmd: "git tag vX.Y.Z", desc: "Mark release" },
            { cmd: "git log", desc: "Confirm what shipped" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Tag the current commit as v1.0.0-academy.",
            expectCommandIncludes: ["git tag"],
            successMessage: "You practiced release marking.",
          },
        ],
      }),
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Common errors and the exact recovery commands.",
    topics: [
      topic({
        slug: "common-errors",
        title: "Common Errors Cheat Rescue",
        summary: "command not found, diverged branches, auth failures.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["error", "troubleshoot", "diverged", "rejected"],
        explanation: `| Error | Likely cause | First move |
| --- | --- | --- |
| command not found | PATH / wrong shell | verify binary & PATH |
| Permission denied (publickey) | SSH key | ssh -T git@github.com |
| failed to push (non-fast-forward) | remote ahead | pull --rebase or pull then push |
| diverged branches | local≠remote history | inspect log both sides |

Stay calm. Read the error. Orient with status.`,
        examples: [
          { title: "Orient", command: "git status", output: "On branch main" },
        ],
        commonMistakes: ["force push to shared main"],
        bestPractices: ["Copy full error into notes", "Reproduce minimally"],
        cheatSheet: {
          summary: "Read → status → remote -v → fix.",
          commands: [
            { cmd: "git status", desc: "Always first" },
            { cmd: "git pull", desc: "Integrate remote" },
            { cmd: "git push", desc: "Retry publish" },
          ],
          commonErrors: [
            "command not found",
            "Permission denied (publickey)",
            "non-fast-forward",
          ],
          recovery: ["pull --rebase for simple divergence (team permitting)"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Practice the debug opener: git status.",
            expectCommandIncludes: ["git status"],
            successMessage: "Troubleshooting starts with orientation.",
          },
        ],
      }),
    ],
  },
  {
    slug: "cheat-sheets",
    title: "Cheat Sheets",
    description: "Quick reference for terminal and Git — keep this open while working.",
    topics: [
      topic({
        slug: "terminal-cheatsheet",
        title: "Terminal Cheat Sheet",
        summary: "High-frequency shell commands in one place.",
        estimatedMinutes: 8,
        difficulty: "beginner",
        keywords: ["cheatsheet", "terminal", "shortcuts"],
        explanation: `Use this page as your docked reference. Search the academy for any command name to jump back to its lesson.`,
        examples: [
          { title: "Where am I?", command: "pwd", output: "/home/student" },
        ],
        commonMistakes: ["Memorizing without practice"],
        bestPractices: ["Practice each command in the simulator today"],
        cheatSheet: {
          summary: "Navigation + files + search.",
          commands: [
            { cmd: "pwd / ls / cd", desc: "Navigate" },
            { cmd: "mkdir / touch", desc: "Create" },
            { cmd: "cp / mv / rm", desc: "Reorganize" },
            { cmd: "cat / grep / find", desc: "Inspect" },
            { cmd: "export / env", desc: "Environment" },
          ],
          shortcuts: ["↑ history", "Tab complete (real shells)", "Ctrl+C cancel (real)"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run three navigation commands: pwd, ls, cd projects.",
            expectCommandIncludes: ["ls"],
            successMessage: "Cheat sheet commands exercised.",
          },
        ],
      }),
      topic({
        slug: "git-cheatsheet",
        title: "Git Cheat Sheet",
        summary: "Everyday Git + recovery commands.",
        estimatedMinutes: 8,
        difficulty: "beginner",
        keywords: ["cheatsheet", "git", "commands"],
        explanation: `Pin this mentally: status, add, commit, branch, switch, merge, log, stash, remote, push, pull, reflog.`,
        examples: [
          { title: "Status", command: "git status", output: "On branch main" },
        ],
        commonMistakes: ["Skipping status"],
        bestPractices: ["status before every risky command"],
        cheatSheet: {
          summary: "Core loop + rescue.",
          commands: [
            { cmd: "git init / status / add / commit", desc: "Core" },
            { cmd: "git branch / switch / merge", desc: "Branches" },
            { cmd: "git remote / push / pull", desc: "GitHub" },
            { cmd: "git stash / reflog / reset", desc: "Rescue" },
          ],
          recovery: ["reflog → branch <hash>", "stash list → stash pop"],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Run git status after ensuring the repo is initialized.",
            expectCommandIncludes: ["git status"],
            successMessage: "Git cheat sheet in action.",
          },
        ],
      }),
    ],
  },
  {
    slug: "final-project",
    title: "Final Project",
    description: "Prove job-readiness with a complete repository workflow.",
    topics: [
      topic({
        slug: "final-workflow-project",
        title: "Final Project: Complete Workflow",
        summary: "Init → branches → commits → remote → push → merge → recover.",
        estimatedMinutes: 45,
        difficulty: "advanced",
        keywords: ["final project", "capstone", "workflow"],
        diagram: "pr-flow",
        explanation: `**Mission**
1. Create project folder \`acme-app\`
2. \`git init\`
3. Add README + commit
4. Create \`feature/home\` branch, commit a file
5. Merge back to main
6. Add \`origin\` remote and \`git push\`
7. Create another branch, stash a change, pop it
8. Tag \`v1.0.0\`
9. Show \`git log\` and \`git reflog\`

When finished, you can operate as a junior developer on day one of a team.`,
        examples: [
          { title: "Start", command: "mkdir acme-app", output: "" },
        ],
        commonMistakes: ["Skipping verification steps", "No commit messages"],
        bestPractices: ["Check status between every major step", "Narrate what you are doing"],
        cheatSheet: {
          summary: "Execute the mission checklist top to bottom.",
          commands: [
            { cmd: "mkdir / touch / git init", desc: "Bootstrap" },
            { cmd: "git checkout -b / commit / merge", desc: "Feature flow" },
            { cmd: "git remote add / push / tag", desc: "Publish" },
          ],
        },
        practiceTasks: [
          {
            id: "t1",
            prompt: "Create acme-app, init git, and make your first commit.",
            expectCommandIncludes: ["git commit"],
            successMessage: "Final project underway — finish the full checklist.",
          },
        ],
      }),
    ],
  },
];

export function flattenToolingTopics(): ToolingTopicDef[] {
  return DEVELOPER_TOOLING_SECTIONS.flatMap((s) => s.topics);
}

export function findToolingTopic(
  slug: string
): { section: ToolingSectionDef; topic: ToolingTopicDef } | null {
  for (const section of DEVELOPER_TOOLING_SECTIONS) {
    const topic = section.topics.find((t) => t.slug === slug);
    if (topic) return { section, topic };
  }
  return null;
}

export function toolingTopicCount(): number {
  return flattenToolingTopics().length;
}

export function toolingSectionCount(): number {
  return DEVELOPER_TOOLING_SECTIONS.length;
}
