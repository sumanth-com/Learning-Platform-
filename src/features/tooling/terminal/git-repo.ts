/** Simplified Git repository model for interactive learning. */

import {
  getNode,
  listNames,
  type VfsDir,
  type VfsNode,
} from "@/features/tooling/terminal/vfs";

export type GitCommit = {
  hash: string;
  message: string;
  parent: string | null;
  files: Record<string, string>;
  timestamp: number;
};

export type GitRemote = {
  url: string;
  branches: Record<string, string>;
};

export type GitRepo = {
  initialized: boolean;
  head: string;
  branch: string;
  branches: Record<string, string>;
  commits: Record<string, GitCommit>;
  staging: Record<string, string | null>;
  remotes: Record<string, GitRemote>;
  stash: Array<{ message: string; files: Record<string, string> }>;
  lastError: string | null;
};

export function createEmptyGit(): GitRepo {
  return {
    initialized: false,
    head: "",
    branch: "main",
    branches: {},
    commits: {},
    staging: {},
    remotes: {},
    stash: [],
    lastError: null,
  };
}

function shortHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

function walkFiles(
  node: VfsNode,
  prefix: string,
  out: Record<string, string>
) {
  if (node.type === "file") {
    out[prefix] = node.content;
    return;
  }
  for (const [name, child] of Object.entries(node.children)) {
    if (name === ".git") continue;
    const path = prefix ? `${prefix}/${name}` : name;
    walkFiles(child, path, out);
  }
}

export function snapshotWorktree(
  root: VfsDir,
  repoPath: string
): Record<string, string> {
  const node = getNode(root, repoPath);
  const out: Record<string, string> = {};
  if (!node) return out;
  if (node.type === "file") {
    out["."] = node.content;
    return out;
  }
  walkFiles(node, "", out);
  return out;
}

export function headCommit(repo: GitRepo): GitCommit | null {
  if (!repo.head) return null;
  return repo.commits[repo.head] ?? null;
}

export function committedFiles(repo: GitRepo): Record<string, string> {
  return headCommit(repo)?.files ?? {};
}

export function statusLines(
  repo: GitRepo,
  worktree: Record<string, string>
): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  const lines: string[] = [
    `On branch ${repo.branch}`,
    "",
  ];
  const staged = Object.entries(repo.staging).filter(([, v]) => v !== undefined);
  const stagedAdd = staged.filter(([, v]) => v !== null);
  const stagedDel = staged.filter(([, v]) => v === null);

  if (stagedAdd.length || stagedDel.length) {
    lines.push("Changes to be committed:");
    for (const [path] of stagedAdd) lines.push(`\tnew file / modified:   ${path}`);
    for (const [path] of stagedDel) lines.push(`\tdeleted:    ${path}`);
    lines.push("");
  }

  const committed = committedFiles(repo);
  const unstaged: string[] = [];
  const untracked: string[] = [];

  for (const [path, content] of Object.entries(worktree)) {
    if (path.startsWith(".git")) continue;
    const stagedContent = repo.staging[path];
    const base =
      stagedContent !== undefined
        ? stagedContent
        : committed[path];
    if (base === undefined) {
      if (!(path in repo.staging)) untracked.push(path);
    } else if (base !== content && stagedContent === undefined) {
      unstaged.push(path);
    } else if (
      stagedContent !== undefined &&
      stagedContent !== null &&
      stagedContent !== content
    ) {
      unstaged.push(path);
    }
  }

  for (const path of Object.keys(committed)) {
    if (!(path in worktree) && !(path in repo.staging)) {
      unstaged.push(path);
    }
  }

  if (unstaged.length) {
    lines.push("Changes not staged for commit:");
    for (const path of unstaged) lines.push(`\tmodified:   ${path}`);
    lines.push("");
  }
  if (untracked.length) {
    lines.push("Untracked files:");
    for (const path of untracked) lines.push(`\t${path}`);
    lines.push("");
  }
  if (!stagedAdd.length && !stagedDel.length && !unstaged.length && !untracked.length) {
    lines.push("nothing to commit, working tree clean");
  }
  return lines;
}

export function gitInit(repo: GitRepo): string[] {
  if (repo.initialized) return ["Reinitialized existing Git repository"];
  repo.initialized = true;
  repo.branch = "main";
  repo.head = "";
  repo.branches = { main: "" };
  return ["Initialized empty Git repository in .git/"];
}

export function gitAdd(
  repo: GitRepo,
  worktree: Record<string, string>,
  paths: string[]
): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  const targets =
    paths.includes(".") || paths.includes("-A") || paths.includes("--all")
      ? Object.keys(worktree)
      : paths;
  for (const path of targets) {
    if (path in worktree) {
      repo.staging[path] = worktree[path]!;
    } else if (path in committedFiles(repo)) {
      repo.staging[path] = null;
    } else {
      return [`fatal: pathspec '${path}' did not match any files`];
    }
  }
  return [];
}

export function gitCommit(repo: GitRepo, message: string): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  const stagedEntries = Object.entries(repo.staging);
  if (!stagedEntries.length && !repo.head) {
    return ["nothing to commit (create/copy files and use \"git add\" to track)"];
  }
  if (!stagedEntries.length) {
    return ["nothing to commit, working tree clean"];
  }
  if (!message.trim()) {
    return ["error: switch `m' requires a value"];
  }
  const files = { ...committedFiles(repo) };
  for (const [path, content] of stagedEntries) {
    if (content === null) delete files[path];
    else files[path] = content;
  }
  const hash = shortHash();
  repo.commits[hash] = {
    hash,
    message: message.trim(),
    parent: repo.head || null,
    files,
    timestamp: Date.now(),
  };
  repo.head = hash;
  repo.branches[repo.branch] = hash;
  repo.staging = {};
  return [`[${repo.branch} ${hash}] ${message.trim()}`];
}

export function gitBranch(repo: GitRepo, name?: string): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (!name) {
    return Object.keys(repo.branches).map((b) =>
      b === repo.branch ? `* ${b}` : `  ${b}`
    );
  }
  if (repo.branches[name]) return [`fatal: branch '${name}' already exists`];
  repo.branches[name] = repo.head;
  return [];
}

export function gitCheckout(repo: GitRepo, name: string, create = false): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (create) {
    if (!repo.branches[name]) repo.branches[name] = repo.head;
  }
  if (!(name in repo.branches)) {
    return [`error: pathspec '${name}' did not match any known branch`];
  }
  repo.branch = name;
  repo.head = repo.branches[name] || "";
  repo.staging = {};
  return [`Switched to ${create ? "a new " : ""}branch '${name}'`];
}

export function gitLog(repo: GitRepo, max = 8): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (!repo.head) return ["fatal: your current branch does not have any commits yet"];
  const lines: string[] = [];
  let cur: string | null = repo.head;
  let n = 0;
  while (cur && n < max) {
    const c: GitCommit | undefined = repo.commits[cur];
    if (!c) break;
    lines.push(`commit ${c.hash}`);
    lines.push(`Author: Student <student@SupraBase.dev>`);
    lines.push(`Date:   ${new Date(c.timestamp).toUTCString()}`);
    lines.push("");
    lines.push(`    ${c.message}`);
    lines.push("");
    cur = c.parent;
    n += 1;
  }
  return lines;
}

export function gitRemote(
  repo: GitRepo,
  args: string[]
): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (!args.length) return Object.keys(repo.remotes);
  if (args[0] === "-v") {
    return Object.entries(repo.remotes).flatMap(([name, r]) => [
      `${name}\t${r.url} (fetch)`,
      `${name}\t${r.url} (push)`,
    ]);
  }
  if (args[0] === "add" && args[1] && args[2]) {
    repo.remotes[args[1]] = { url: args[2], branches: { ...repo.branches } };
    return [];
  }
  return ["usage: git remote [-v] | git remote add <name> <url>"];
}

export function gitPush(repo: GitRepo, remoteName = "origin"): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  const remote = repo.remotes[remoteName];
  if (!remote) return [`fatal: '${remoteName}' does not appear to be a git repository`];
  remote.branches[repo.branch] = repo.head;
  return [
    `Enumerating objects: done.`,
    `To ${remote.url}`,
    ` * [new branch]      ${repo.branch} -> ${repo.branch}`,
  ];
}

export function gitPull(repo: GitRepo, remoteName = "origin"): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  const remote = repo.remotes[remoteName];
  if (!remote) return [`fatal: '${remoteName}' does not appear to be a git repository`];
  const remoteHead = remote.branches[repo.branch];
  if (!remoteHead) return [`From ${remote.url}`, " * branch already up to date"];
  if (remoteHead === repo.head) return ["Already up to date."];
  repo.head = remoteHead;
  repo.branches[repo.branch] = remoteHead;
  return [`Updating to ${remoteHead}`, "Fast-forward"];
}

export function gitStash(repo: GitRepo, worktree: Record<string, string>, mode: "push" | "list" | "pop"): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (mode === "list") {
    if (!repo.stash.length) return [];
    return repo.stash.map((s, i) => `stash@{${i}}: ${s.message}`);
  }
  if (mode === "push") {
    const committed = committedFiles(repo);
    const dirty: Record<string, string> = {};
    for (const [path, content] of Object.entries(worktree)) {
      if (committed[path] !== content) dirty[path] = content;
    }
    if (!Object.keys(dirty).length) return ["No local changes to save"];
    repo.stash.unshift({ message: `WIP on ${repo.branch}`, files: dirty });
    return ["Saved working directory and index state WIP"];
  }
  const top = repo.stash.shift();
  if (!top) return ["No stash entries found."];
  return [`Dropped refs/stash@{0} (${Object.keys(top.files).length} files)`];
}

export function gitMerge(repo: GitRepo, branch: string): string[] {
  if (!repo.initialized) return ["fatal: not a git repository"];
  if (!(branch in repo.branches)) {
    return [`merge: ${branch} - not something we can merge`];
  }
  const theirs = repo.branches[branch] || "";
  if (!theirs) return [`Already up to date.`];
  if (theirs === repo.head) return ["Already up to date."];
  const ourFiles = committedFiles(repo);
  const theirCommit = repo.commits[theirs];
  if (!theirCommit) return ["error: bad revision"];
  const merged = { ...ourFiles, ...theirCommit.files };
  const hash = shortHash();
  repo.commits[hash] = {
    hash,
    message: `Merge branch '${branch}'`,
    parent: repo.head || null,
    files: merged,
    timestamp: Date.now(),
  };
  repo.head = hash;
  repo.branches[repo.branch] = hash;
  return [`Merge made by the 'ort' strategy.`, `Fast-forward-ish merge of '${branch}'`];
}

export function listRepoHint(root: VfsDir, cwd: string): string[] {
  const node = getNode(root, cwd);
  if (!node || node.type !== "dir") return [];
  return listNames(node, true);
}
