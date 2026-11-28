/**
 * Worship service program ("Chương trình") state model and pure operations.
 * Stored as an ordered list of discriminated items in localStorage.
 */

export type ProgramItem =
  | { kind: "thanh-ca"; number: number; code: string; title: string }
  | { kind: "tvchh"; number: number; code: string; title: string }
  | { kind: "doi-dap"; number: number; code: string; title: string }
  | { kind: "tin-dieu"; code: string; title: string };

export const PROGRAM_STORAGE_KEY = "kt_worship_program_v1";

export function programItemId(item: ProgramItem): string {
  switch (item.kind) {
    case "thanh-ca":
    case "tvchh":
    case "doi-dap":
      return `${item.kind}:${item.number}`;
    case "tin-dieu":
      return "tin-dieu";
  }
}

export function hasProgramItem(list: readonly ProgramItem[], id: string): boolean {
  return list.some((item) => programItemId(item) === id);
}

export function toggleProgramItem(list: readonly ProgramItem[], item: ProgramItem): ProgramItem[] {
  const id = programItemId(item);
  if (hasProgramItem(list, id)) {
    return list.filter((entry) => programItemId(entry) !== id);
  }
  return [...list, item];
}

export function removeProgramItem(list: readonly ProgramItem[], id: string): ProgramItem[] {
  return list.filter((entry) => programItemId(entry) !== id);
}

export function moveProgramItem(list: readonly ProgramItem[], index: number, delta: -1 | 1): ProgramItem[] {
  const target = index + delta;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return [...list];
  const next = [...list];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

function parseProgramItem(raw: unknown): ProgramItem | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const { kind, code, title } = obj;
  if (typeof code !== "string" || typeof title !== "string") return null;
  if (kind === "tin-dieu") {
    return { kind: "tin-dieu", code, title };
  }
  if (kind === "thanh-ca" || kind === "tvchh" || kind === "doi-dap") {
    const num = obj.number;
    if (typeof num !== "number" || !Number.isInteger(num) || num < 1) return null;
    return { kind, number: num, code, title };
  }
  return null;
}

/** Validates untrusted JSON from localStorage at the boundary; drops invalid entries cleanly. */
export function parseProgramStorage(raw: string | null): ProgramItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const items: ProgramItem[] = [];
    for (const entry of parsed) {
      const valid = parseProgramItem(entry);
      if (!valid) continue;
      const id = programItemId(valid);
      if (seen.has(id)) continue;
      seen.add(id);
      items.push(valid);
    }
    return items;
  } catch {
    return [];
  }
}
