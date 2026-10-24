import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ROLES = [
  "ops_central",
  "partnerships",
  "mc",
  "oos",
  "mc+oos",
  "volunteer",
] as const;
export const PHASES = ["pre", "dia", "post"] as const;

export type Role = (typeof ROLES)[number];
export type Phase = (typeof PHASES)[number];

export interface TaskTemplate {
  id: string;
  task: string;
  /** Days relative to the event (negative = before). null = no fixed date. */
  days: number | null;
  role: Role;
  phase: Phase;
  /** '' | 'ciudad-nueva' | 'ciudad:<CODE>' */
  condition: string;
  pillar: string;
}

const INT = /^-?\d+$/;

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/**
 * Reads the task rows of one `tareas.md`. Column order is fixed:
 * ID | Tarea | Días | Rol | Fase | Condición. Alignment whitespace is ignored.
 */
export function parseTasks(markdown: string, pillar: string): TaskTemplate[] {
  const out: TaskTemplate[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const c = cells(line);
    if (!/^T\d{3}$/.test(c[0] ?? "")) continue;
    const [id, task, rawDays, rawRole, rawPhase, condition = ""] = c as [
      string,
      string,
      string,
      string,
      string,
      string?,
    ];
    let days: number | null;
    if (rawDays === "—" || rawDays === "") days = null;
    else if (INT.test(rawDays)) days = Number(rawDays);
    else throw new Error(`${id}: "Días" inválido: ${rawDays}`);
    if (!(ROLES as readonly string[]).includes(rawRole)) {
      throw new Error(`${id}: rol inválido: ${rawRole}`);
    }
    if (!(PHASES as readonly string[]).includes(rawPhase)) {
      throw new Error(`${id}: fase inválida: ${rawPhase}`);
    }
    if (
      condition !== "" &&
      condition !== "ciudad-nueva" &&
      !/^ciudad:[A-Z]{2,4}$/.test(condition)
    ) {
      throw new Error(`${id}: condición inválida: ${condition}`);
    }
    out.push({
      id,
      task,
      days,
      role: rawRole as Role,
      phase: rawPhase as Phase,
      condition,
      pillar,
    });
  }
  return out;
}

/** Loads every `pilares/<pilar>/tareas.md` under the playbook directory. */
export function loadAllTasks(playbookDir: string): TaskTemplate[] {
  const pilares = join(playbookDir, "pilares");
  const all: TaskTemplate[] = [];
  for (const pillar of readdirSync(pilares).sort()) {
    const file = join(pilares, pillar, "tareas.md");
    if (!existsSync(file)) continue;
    all.push(...parseTasks(readFileSync(file, "utf8"), pillar));
  }
  return all;
}

export function duplicateIds(tasks: TaskTemplate[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const t of tasks) (seen.has(t.id) ? dup : seen).add(t.id);
  return [...dup];
}
