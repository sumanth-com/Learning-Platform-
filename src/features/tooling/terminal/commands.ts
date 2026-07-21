import {
  cloneVfs,
  createEmptyRoot,
  ensureDir,
  getNode,
  getParent,
  listNames,
  normalizePath,
  writeFile,
  type VfsDir,
} from "@/features/tooling/terminal/vfs";
import {
  createEmptyGit,
  gitAdd,
  gitBranch,
  gitCheckout,
  gitCommit,
  gitInit,
  gitLog,
  gitMerge,
  gitPull,
  gitPush,
  gitRemote,
  gitStash,
  snapshotWorktree,
  statusLines,
  type GitRepo,
} from "@/features/tooling/terminal/git-repo";

export type TerminalState = {
  cwd: string;
  root: VfsDir;
  git: GitRepo;
  history: string[];
  env: Record<string, string>;
};

export type CommandResult = {
  lines: string[];
  clear?: boolean;
  state: TerminalState;
};

export function createInitialTerminalState(): TerminalState {
  return {
    cwd: "/home/student",
    root: createEmptyRoot(),
    git: createEmptyGit(),
    history: [],
    env: {
      HOME: "/home/student",
      USER: "student",
      PATH: "/usr/local/bin:/usr/bin:/bin",
      SHELL: "/bin/bash",
    },
  };
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) {
        tokens.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function withState(state: TerminalState): TerminalState {
  return {
    ...state,
    root: cloneVfs(state.root) as VfsDir,
    git: {
      ...state.git,
      branches: { ...state.git.branches },
      commits: { ...state.git.commits },
      staging: { ...state.git.staging },
      remotes: Object.fromEntries(
        Object.entries(state.git.remotes).map(([k, v]) => [
          k,
          { url: v.url, branches: { ...v.branches } },
        ])
      ),
      stash: state.git.stash.map((s) => ({
        message: s.message,
        files: { ...s.files },
      })),
    },
    history: [...state.history],
    env: { ...state.env },
  };
}

function resolve(state: TerminalState, path: string): string {
  if (path.startsWith("~")) {
    path = path.replace(/^~/, state.env.HOME || "/home/student");
  }
  return normalizePath(state.cwd, path);
}

export function runCommand(state: TerminalState, raw: string): CommandResult {
  const next = withState(state);
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [], state: next };

  next.history.push(trimmed);
  const tokens = tokenize(trimmed);
  const cmd = tokens[0]!;
  const args = tokens.slice(1);

  const fail = (msg: string): CommandResult => ({
    lines: [msg],
    state: next,
  });

  switch (cmd) {
    case "clear":
      return { lines: [], clear: true, state: next };
    case "pwd":
      return { lines: [next.cwd], state: next };
    case "whoami":
      return { lines: [next.env.USER || "student"], state: next };
    case "echo": {
      const text = args
        .map((a) =>
          a.startsWith("$") ? next.env[a.slice(1)] ?? "" : a
        )
        .join(" ");
      return { lines: [text], state: next };
    }
    case "export": {
      for (const a of args) {
        const [k, ...rest] = a.split("=");
        if (k) next.env[k] = rest.join("=");
      }
      return { lines: [], state: next };
    }
    case "env":
    case "printenv":
      return {
        lines: Object.entries(next.env).map(([k, v]) => `${k}=${v}`),
        state: next,
      };
    case "history":
      return {
        lines: next.history.map((h, i) => ` ${i + 1}  ${h}`),
        state: next,
      };
    case "ls": {
      const all = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const targetArg = args.find((a) => !a.startsWith("-")) || ".";
      const path = resolve(next, targetArg);
      const node = getNode(next.root, path);
      if (!node) return fail(`ls: cannot access '${targetArg}': No such file or directory`);
      if (node.type === "file") return { lines: [targetArg], state: next };
      return { lines: [listNames(node, all).join("  ")], state: next };
    }
    case "cd": {
      const target = resolve(next, args[0] || next.env.HOME || "/home/student");
      const node = getNode(next.root, target);
      if (!node) return fail(`cd: no such file or directory: ${args[0] || "~"}`);
      if (node.type !== "dir") return fail(`cd: not a directory: ${args[0]}`);
      next.cwd = target;
      return { lines: [], state: next };
    }
    case "mkdir": {
      if (!args.length) return fail("mkdir: missing operand");
      for (const a of args.filter((x) => x !== "-p")) {
        const path = resolve(next, a);
        const err = ensureDir(next.root, path);
        if (err) return fail(`mkdir: ${err}`);
      }
      return { lines: [], state: next };
    }
    case "touch": {
      if (!args.length) return fail("touch: missing file operand");
      for (const a of args) {
        const path = resolve(next, a);
        const existing = getNode(next.root, path);
        if (existing?.type === "dir") return fail(`touch: cannot touch '${a}': Is a directory`);
        if (!existing) {
          const parent = getParent(next.root, path);
          if (!parent) return fail(`touch: cannot touch '${a}': No such file or directory`);
          parent.parent.children[parent.name] = { type: "file", content: "" };
        }
      }
      return { lines: [], state: next };
    }
    case "cat": {
      if (!args.length) return fail("cat: missing file operand");
      const lines: string[] = [];
      for (const a of args) {
        const node = getNode(next.root, resolve(next, a));
        if (!node) return fail(`cat: ${a}: No such file or directory`);
        if (node.type !== "file") return fail(`cat: ${a}: Is a directory`);
        lines.push(...node.content.replace(/\n$/, "").split("\n"));
      }
      return { lines, state: next };
    }
    case "rm": {
      const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
      const targets = args.filter((a) => !a.startsWith("-"));
      if (!targets.length) return fail("rm: missing operand");
      for (const a of targets) {
        const path = resolve(next, a);
        const parent = getParent(next.root, path);
        const node = getNode(next.root, path);
        if (!parent || !node) return fail(`rm: cannot remove '${a}': No such file or directory`);
        if (node.type === "dir" && !recursive) {
          return fail(`rm: cannot remove '${a}': Is a directory`);
        }
        delete parent.parent.children[parent.name];
      }
      return { lines: [], state: next };
    }
    case "cp": {
      if (args.length < 2) return fail("cp: missing file operand");
      const src = resolve(next, args[0]!);
      const dest = resolve(next, args[1]!);
      const node = getNode(next.root, src);
      if (!node) return fail(`cp: cannot stat '${args[0]}': No such file or directory`);
      if (node.type !== "file") return fail("cp: directories not supported in this simulator (use files)");
      const err = writeFile(next.root, dest, node.content);
      if (err) return fail(`cp: ${err}`);
      return { lines: [], state: next };
    }
    case "mv": {
      if (args.length < 2) return fail("mv: missing file operand");
      const src = resolve(next, args[0]!);
      const dest = resolve(next, args[1]!);
      const node = getNode(next.root, src);
      const parent = getParent(next.root, src);
      if (!node || !parent) return fail(`mv: cannot stat '${args[0]}': No such file or directory`);
      parent.parent.children[parent.name] && delete parent.parent.children[parent.name];
      const destParent = getParent(next.root, dest);
      if (!destParent) return fail(`mv: cannot move to '${args[1]}'`);
      destParent.parent.children[destParent.name] = node;
      return { lines: [], state: next };
    }
    case "find": {
      const start = resolve(next, args[0] || ".");
      const nameIdx = args.indexOf("-name");
      const pattern = nameIdx >= 0 ? args[nameIdx + 1] : null;
      const found: string[] = [];
      const walk = (path: string) => {
        const node = getNode(next.root, path);
        if (!node) return;
        const base = path.split("/").pop() || path;
        if (!pattern || base.includes(pattern.replace(/\*/g, ""))) {
          if (path !== start || !pattern) found.push(path);
          else if (pattern && base.includes(pattern.replace(/\*/g, ""))) found.push(path);
        }
        if (node.type === "dir") {
          for (const name of Object.keys(node.children)) {
            walk(path === "/" ? `/${name}` : `${path}/${name}`);
          }
        }
      };
      walk(start);
      return { lines: found.length ? found : [], state: next };
    }
    case "grep": {
      if (args.length < 2) return fail("usage: grep <pattern> <file>");
      const pattern = args[0]!;
      const file = resolve(next, args[1]!);
      const node = getNode(next.root, file);
      if (!node || node.type !== "file") return fail(`grep: ${args[1]}: No such file or directory`);
      const hits = node.content
        .split("\n")
        .filter((line) => line.includes(pattern));
      return { lines: hits, state: next };
    }
    case "git":
      return runGit(next, args);
    case "help":
      return {
        lines: [
          "SupraLearn Terminal — try:",
          "  pwd  ls  cd  mkdir  touch  cat  cp  mv  rm  clear  history",
          "  find  grep  echo  export  env",
          "  git init | status | add | commit | branch | checkout | log | remote | push | pull | stash | merge",
        ],
        state: next,
      };
    default:
      return fail(`command not found: ${cmd}`);
  }
}

function runGit(state: TerminalState, args: string[]): CommandResult {
  if (!args.length) {
    return {
      lines: ["usage: git <command>", "Try: status, init, add, commit, branch, log, ..."],
      state,
    };
  }
  const sub = args[0]!;
  const rest = args.slice(1);
  const worktree = snapshotWorktree(state.root, state.cwd);

  switch (sub) {
    case "init":
      return { lines: gitInit(state.git), state };
    case "status":
      return { lines: statusLines(state.git, worktree), state };
    case "add":
      return { lines: gitAdd(state.git, worktree, rest.length ? rest : ["."]), state };
    case "commit": {
      const mi = rest.indexOf("-m");
      const message =
        mi >= 0
          ? rest.slice(mi + 1).join(" ").replace(/^["']|["']$/g, "")
          : "";
      return { lines: gitCommit(state.git, message), state };
    }
    case "branch":
      return { lines: gitBranch(state.git, rest[0]), state };
    case "checkout": {
      const create = rest[0] === "-b";
      const name = create ? rest[1] : rest[0];
      if (!name) return { lines: ["fatal: you must specify a branch"], state };
      return { lines: gitCheckout(state.git, name, create), state };
    }
    case "switch": {
      const create = rest[0] === "-c";
      const name = create ? rest[1] : rest[0];
      if (!name) return { lines: ["fatal: missing branch name"], state };
      return { lines: gitCheckout(state.git, name, create), state };
    }
    case "log":
      return { lines: gitLog(state.git), state };
    case "diff":
      return {
        lines: [
          "diff -- simulated",
          "Use git status to see changed files in this academy terminal.",
        ],
        state,
      };
    case "remote":
      return { lines: gitRemote(state.git, rest), state };
    case "push":
      return { lines: gitPush(state.git, rest[0] || "origin"), state };
    case "pull":
      return { lines: gitPull(state.git, rest[0] || "origin"), state };
    case "fetch":
      return { lines: ["From origin", " * [simulated] fetch complete"], state };
    case "stash": {
      const mode =
        rest[0] === "list" ? "list" : rest[0] === "pop" ? "pop" : "push";
      return { lines: gitStash(state.git, worktree, mode), state };
    }
    case "merge":
      if (!rest[0]) return { lines: ["fatal: you must specify a branch"], state };
      return { lines: gitMerge(state.git, rest[0]), state };
    case "rebase":
      return {
        lines: [
          "Rebase is available conceptually in Advanced Git.",
          "In this simulator, prefer merge for practice, then read the rebase lesson.",
        ],
        state,
      };
    case "tag":
      return {
        lines: rest[0] ? [`Annotated tag '${rest[0]}' recorded (simulated)`] : ["(no tags)"],
        state,
      };
    case "restore":
    case "reset":
      state.git.staging = {};
      return {
        lines: [`${sub}: staging area cleared (simplified simulator)`],
        state,
      };
    case "reflog":
      return {
        lines: Object.values(state.git.commits)
          .slice(-5)
          .reverse()
          .map((c, i) => `${c.hash} HEAD@{${i}}: commit: ${c.message}`),
        state,
      };
    case "cherry-pick":
      return {
        lines: ["cherry-pick: covered in Advanced Git (use merge here for practice)"],
        state,
      };
    default:
      return {
        lines: [`git: '${sub}' is not a supported academy command. Try help.`],
        state,
      };
  }
}

export type VisualGitStage = {
  working: number;
  staging: number;
  local: number;
  remote: number;
  branch: string;
  lastAction: string | null;
};

export function visualGitFromState(state: TerminalState): VisualGitStage {
  const worktree = snapshotWorktree(state.root, state.cwd);
  const staged = Object.keys(state.git.staging).length;
  const local = Object.keys(state.git.commits).length;
  const remote = Object.values(state.git.remotes).reduce(
    (n, r) => n + Object.keys(r.branches).filter((b) => r.branches[b]).length,
    0
  );
  const dirty = Object.keys(worktree).length;
  return {
    working: dirty,
    staging: staged,
    local,
    remote,
    branch: state.git.branch,
    lastAction: state.history[state.history.length - 1] ?? null,
  };
}
