/** Virtual filesystem + shell helpers for the Developer Tooling terminal. */

export type VfsFile = { type: "file"; content: string };
export type VfsDir = { type: "dir"; children: Record<string, VfsNode> };
export type VfsNode = VfsFile | VfsDir;

export function createEmptyRoot(): VfsDir {
  return {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          student: {
            type: "dir",
            children: {
              projects: { type: "dir", children: {} },
              "notes.txt": {
                type: "file",
                content: "Welcome to the SupraLearn terminal.\n",
              },
            },
          },
        },
      },
    },
  };
}

export function normalizePath(cwd: string, input: string): string {
  const raw = input.startsWith("/")
    ? input
    : `${cwd === "/" ? "" : cwd}/${input}`;
  const parts = raw.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return "/" + stack.join("/");
}

export function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

export function getNode(root: VfsDir, path: string): VfsNode | null {
  if (path === "/") return root;
  let node: VfsNode = root;
  for (const part of splitPath(path)) {
    if (node.type !== "dir") return null;
    const next: VfsNode | undefined = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

export function getParent(
  root: VfsDir,
  path: string
): { parent: VfsDir; name: string } | null {
  const parts = splitPath(path);
  if (parts.length === 0) return null;
  const name = parts[parts.length - 1]!;
  const parentPath = "/" + parts.slice(0, -1).join("/");
  const parent = getNode(root, parentPath);
  if (!parent || parent.type !== "dir") return null;
  return { parent, name };
}

export function ensureDir(root: VfsDir, path: string): string | null {
  if (path === "/") return null;
  const parts = splitPath(path);
  let node: VfsDir = root;
  for (const part of parts) {
    const existing = node.children[part];
    if (!existing) {
      const dir: VfsDir = { type: "dir", children: {} };
      node.children[part] = dir;
      node = dir;
      continue;
    }
    if (existing.type !== "dir") return `Not a directory: ${part}`;
    node = existing;
  }
  return null;
}

export function writeFile(
  root: VfsDir,
  path: string,
  content: string
): string | null {
  const parentInfo = getParent(root, path);
  if (!parentInfo) return "Invalid path";
  const existing = parentInfo.parent.children[parentInfo.name];
  if (existing?.type === "dir") return "Is a directory";
  parentInfo.parent.children[parentInfo.name] = { type: "file", content };
  return null;
}

export function listNames(dir: VfsDir, all = false): string[] {
  return Object.keys(dir.children)
    .filter((n) => all || !n.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

export function cloneVfs(node: VfsNode): VfsNode {
  if (node.type === "file") return { type: "file", content: node.content };
  const children: Record<string, VfsNode> = {};
  for (const [k, v] of Object.entries(node.children)) {
    children[k] = cloneVfs(v);
  }
  return { type: "dir", children };
}
