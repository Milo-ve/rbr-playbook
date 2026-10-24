import { addDays } from "./dates";
import type { Phase, Role, TaskTemplate } from "./tasks";

export interface EventParams {
  /** Event date, ISO. */
  date: string;
  /** City code, e.g. SLP. */
  code: string;
  newCity: boolean;
  /** Task id -> reason, for variants such as community-led. */
  conditionals: Map<string, string>;
  /** "Today", ISO. Events on or before today only get `post` tasks. */
  today: string;
}

export interface EventTask {
  id: string;
  task: string;
  due: string | null;
  role: Role;
  phase: Phase;
  pillar: string;
  note: string;
}

function applies(t: TaskTemplate, p: EventParams): boolean {
  if (t.condition === "") return true;
  if (t.condition === "ciudad-nueva") return p.newCity;
  if (t.condition.startsWith("ciudad:"))
    return t.condition.slice("ciudad:".length) === p.code;
  return false;
}

/**
 * Instantiates the master templates for one event.
 * Past or same-day events only get `post` tasks: `pre` ones would be born overdue.
 */
export function buildEventTasks(
  templates: TaskTemplate[],
  p: EventParams,
): EventTask[] {
  const postOnly = p.date <= p.today;
  const tasks = templates
    .filter((t) => applies(t, p))
    .filter((t) => !postOnly || t.phase === "post")
    .map<EventTask>((t) => {
      const reason = p.conditionals.get(t.id);
      return {
        id: t.id,
        task: t.task,
        due: t.days === null ? null : addDays(p.date, t.days),
        role: t.role,
        phase: t.phase,
        pillar: t.pillar,
        note: reason ? `condicional: ${reason} (por confirmar)` : "",
      };
    });
  return tasks.sort((a, b) => {
    if (a.due === b.due) return a.id.localeCompare(b.id);
    if (a.due === null) return 1;
    if (b.due === null) return -1;
    return a.due.localeCompare(b.due);
  });
}

const esc = (s: string) => s.replace(/\|/g, "\\|");

export function renderTasksMarkdown(id: string, tasks: EventTask[]): string {
  const rows = tasks.map(
    (t) =>
      `| [ ] | ${t.id} | ${esc(t.task)} | ${t.due ?? "—"} | ${t.role} | ${t.pillar} | ${esc(t.note)} |`,
  );
  return [
    "---",
    "type: tareas-del-evento",
    `evento: "${id}"`,
    `total: ${tasks.length}`,
    "---",
    "",
    `# Tareas de ${id}`,
    "",
    "Generado al dar de alta el evento desde `_playbook/pilares/*/tareas.md`. Estados: `[ ]` pendiente · `[~]` en curso · `[x]` hecha · `[-]` no aplica (se cambian con `npm run mark`); las fechas son fecha del evento + días de la plantilla. Si cambia la fecha del evento hay que recalcular las fechas a mano: todavía no existe un script para moverlo (pendiente).",
    "",
    "| Hecho | ID | Tarea | Fecha | Rol | Pilar | Nota |",
    "|---|---|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}
