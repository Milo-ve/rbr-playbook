import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { isIsoDate, today as todayIso } from "./dates";
import { buildEventTasks, renderTasksMarkdown } from "./plan";
import { loadAllTasks } from "./tasks";
import { parseConditionals } from "./variant";

export const CURRENCIES = [
  "USD",
  "MXN",
  "COP",
  "CLP",
  "ARS",
  "PEN",
  "BRL",
] as const;
export const MODELS = ["estandar", "community-led"] as const;
export const STATES = ["tentative", "confirmed", "done", "cancelled"] as const;

export interface StampOptions {
  root: string;
  city: string;
  code: string;
  date: string;
  currency: (typeof CURRENCIES)[number];
  newCity: boolean;
  model: (typeof MODELS)[number];
  state?: (typeof STATES)[number];
  today?: string;
}

export interface StampResult {
  id: string;
  dir: string;
  taskCount: number;
}

/**
 * Placeholders that must end up as bare YAML scalars (a date, a boolean, a keyword).
 * The template quotes them so formatters keep `{{x}}` intact; the quotes are dropped here.
 */
const BARE_KEYS = new Set(["fecha", "ciudad_nueva", "modelo"]);

function replaceInTree(dir: string, vars: Record<string, string>): void {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      replaceInTree(path, vars);
      continue;
    }
    if (!name.endsWith(".md")) continue;
    let text = readFileSync(path, "utf8");
    for (const [k, v] of Object.entries(vars)) {
      if (BARE_KEYS.has(k)) text = text.split(`"{{${k}}}"`).join(v);
      text = text.split(`{{${k}}}`).join(v);
    }
    const left = /\{\{(\w+)\}\}/.exec(text);
    if (left)
      throw new Error(`Placeholder sin valor {{${left[1]}}} en ${path}`);
    writeFileSync(path, text);
  }
}

/** Copies `_templates/evento` into `eventos/<id>` and generates its task list. */
export function stampEvent(o: StampOptions): StampResult {
  if (!isIsoDate(o.date)) throw new Error(`Fecha inválida: ${o.date}`);
  if (!/^[A-Z]{2,4}$/.test(o.code))
    throw new Error(`Código de ciudad inválido: ${o.code}`);
  if (!(CURRENCIES as readonly string[]).includes(o.currency)) {
    throw new Error(`Moneda no soportada: ${o.currency}`);
  }
  if (!(MODELS as readonly string[]).includes(o.model))
    throw new Error(`Modelo inválido: ${o.model}`);

  const id = `${o.date}-${o.code}`;
  const template = join(o.root, "_templates", "evento");
  const dir = join(o.root, "eventos", id);
  if (!existsSync(template))
    throw new Error(`No existe la plantilla: ${template}`);
  if (existsSync(dir)) throw new Error(`El evento ya existe: ${dir}`);

  // Resolve everything that can fail before touching the disk.
  const playbook = join(o.root, "_playbook");
  const templates = loadAllTasks(playbook);
  const variantFile = join(playbook, "variantes", `${o.model}.md`);
  const conditionals =
    o.model !== "estandar" && existsSync(variantFile)
      ? parseConditionals(readFileSync(variantFile, "utf8"))
      : new Map<string, string>();
  const tasks = buildEventTasks(templates, {
    date: o.date,
    code: o.code,
    newCity: o.newCity,
    conditionals,
    today: o.today ?? todayIso(),
  });

  cpSync(template, dir, { recursive: true });
  replaceInTree(dir, {
    id,
    ciudad: o.city,
    codigo: o.code,
    fecha: o.date,
    ciudad_nueva: String(o.newCity),
    modelo: o.model,
    moneda_local: o.currency,
  });
  if (o.state && o.state !== "tentative") {
    const file = join(dir, "EVENTO.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace(
        /^estado: tentative$/m,
        `estado: ${o.state}`,
      ),
    );
  }
  writeFileSync(
    join(dir, "tareas-del-evento.md"),
    renderTasksMarkdown(id, tasks),
  );
  return { id, dir, taskCount: tasks.length };
}
