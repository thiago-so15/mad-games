import type { FsNode } from "@/types/os";
import { ROOT_ID } from "@/data/default-state";

export function getNode(files: FsNode[], id: string): FsNode | undefined {
  return files.find((node) => node.id === id);
}

export function getChildren(files: FsNode[], parentId: string, includeHidden = false): FsNode[] {
  return files
    .filter((node) => node.parentId === parentId && (includeHidden || !node.hidden))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function getPath(files: FsNode[], id: string): FsNode[] {
  const path: FsNode[] = [];
  let current = getNode(files, id);
  const guard = new Set<string>();
  while (current && !guard.has(current.id)) {
    guard.add(current.id);
    path.unshift(current);
    current = current.parentId ? getNode(files, current.parentId) : undefined;
  }
  return path;
}

export function formatPath(files: FsNode[], id: string): string {
  const path = getPath(files, id);
  if (path.length === 0) return "MAD";
  return path.map((node) => node.name).join("/");
}

export function findByPath(files: FsNode[], rawPath: string): FsNode | undefined {
  const cleaned = rawPath.replace(/^C:\\MAD\\?/i, "").replace(/^\/+/, "").replace(/\\/g, "/");
  if (!cleaned || cleaned === "MAD") return getNode(files, ROOT_ID);

  const parts = cleaned.split("/").filter(Boolean);
  let current = getNode(files, ROOT_ID);
  for (const part of parts) {
    if (!current) return undefined;
    const children = files.filter((node) => node.parentId === current?.id);
    current = children.find((node) => node.name.toLowerCase() === part.toLowerCase());
  }
  return current;
}

export function uniqueName(files: FsNode[], parentId: string, baseName: string): string {
  const names = new Set(files.filter((node) => node.parentId === parentId).map((node) => node.name));
  if (!names.has(baseName)) return baseName;
  const dot = baseName.lastIndexOf(".");
  const stem = dot > 0 ? baseName.slice(0, dot) : baseName;
  const ext = dot > 0 ? baseName.slice(dot) : "";
  let i = 2;
  while (names.has(`${stem} ${i}${ext}`)) i += 1;
  return `${stem} ${i}${ext}`;
}

export function estimateStorageBytes(files: FsNode[], trashCount: number): number {
  const content = files.reduce((sum, node) => sum + (node.content?.length ?? 0) + node.name.length, 0);
  return content + trashCount * 64 + files.length * 48;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
