import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { parseFrontmatter } from "./frontmatter";
import { duplicateIds, loadAllTasks } from "./tasks";
import { parseConditionals } from "./variant";

export interface Issue {
  level: "error" | "warn";
  file: string;
  message: string;
}

const SKIP_DIRS = new Set(["node_modules", ".git", "_private", "_archive"]);
const MAX_ENTRY_LINES = 60;
const STAGE_DIR = /^\d{2}_/;
const REQUIRED_SECTIONS = [
  "## Inputs",
  "## Process",
  "## Outputs",
  "## Human check",
];
const STAGES = [
  "00_alta",
  "01_presupuesto",
  "02_adquisicion",
  "03_sponsors",
  "04_operaciones",
  "05_dia-del-evento",
  "06_cierre",
];

/** Paths that are produced later, so a contract may point at them before they exist. */
export function isFuturePath(p: string): boolean {
  return (
    /(^|\/)(output|private)(\/|$)/.test(p) ||
    p.endsWith("tareas-del-evento.md") ||
    p.includes("{{")
  );
}

/** A currency marker followed by digits, e.g. `$1,200`, `USD 500`, `10000 MXN`. */
export function hasMoneyAmount(text: string): boolean {
  return /(\$|USD|MXN|EUR)\s?\d[\d,.]*|\d[\d,.]*\s?(USD|MXN|EUR)\b/.test(text);
}

export function extractLinks(markdown: string): string[] {
  const out: string[] = [];
  for (const m of markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = (m[1] ?? "").split("#")[0] ?? "";
    if (target === "" || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    out.push(target);
  }
  return out;
}

/** Paths listed as `- Working (...): path` / `- Reference (...): path`. */
export function extractInputPaths(markdown: string): string[] {
  const out: string[] = [];
  for (const m of markdown.matchAll(
    /^- (?:Working|Reference) \([^)]*\):\s*(\S+)/gm,
  )) {
    out.push((m[1] ?? "").replace(/[.,;]$/, ""));
  }
  return out;
}

export function missingSections(markdown: string): string[] {
  const missing = REQUIRED_SECTIONS.filter(
    (s) => !new RegExp(`^${s}\\s*$`, "m").test(markdown),
  );
  if (!/^One job:/m.test(markdown)) missing.push("One job:");
  return missing;
}

export function lineCount(text: string): number {
  return text.replace(/\n$/, "").split("\n").length;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), out);
    } else if (e.name.endsWith(".md")) out.push(join(dir, e.name));
  }
  return out;
}

export function runChecks(root: string): Issue[] {
  const issues: Issue[] = [];
  const rel = (f: string) => relative(root, f);
  const add = (level: Issue["level"], file: string, message: string) =>
    issues.push({ level, file: rel(file), message });

  const files = walk(root);

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const name = file.split("/").pop() as string;
    const dir = dirname(file);

    for (const link of extractLinks(text)) {
      if (isFuturePath(link)) continue;
      if (!existsSync(resolve(dir, link)))
        add("error", file, `enlace roto: ${link}`);
    }

    if (name === "CLAUDE.md" && lineCount(text) > MAX_ENTRY_LINES) {
      add(
        "error",
        file,
        `archivo de entrada de ${lineCount(text)} líneas (máximo ${MAX_ENTRY_LINES})`,
      );
    }

    if (
      name === "CONTEXT.md" &&
      STAGE_DIR.test(dir.split("/").pop() as string)
    ) {
      for (const s of missingSections(text))
        add("error", file, `al contrato le falta: ${s}`);
      for (const p of extractInputPaths(text)) {
        if (isFuturePath(p)) continue;
        if (!existsSync(resolve(dir, p)))
          add("error", file, `entrada inexistente: ${p}`);
      }
    }

    if (/\/(03_sponsors|01_presupuesto)\/output\/[^/]+\.md$/.test(file) && hasMoneyAmount(text)) {
      add("warn", file, "posible monto de dinero en un archivo versionado; los montos van en private/");
    }

    if (/_playbook\/pilares\/[^/]+\/(playbook|tareas)\.md$/.test(file)) {
      if (!parseFrontmatter(text)?.type)
        add("error", file, "falta frontmatter con `type`");
    }
  }

  // Event folders: required shape and consistent identity.
  const eventsDir = join(root, "eventos");
  if (existsSync(eventsDir)) {
    for (const d of readdirSync(eventsDir, { withFileTypes: true }).filter(
      (x) => x.isDirectory(),
    )) {
      const dir = join(eventsDir, d.name);
      for (const f of ["CLAUDE.md", "EVENTO.md", "tareas-del-evento.md"]) {
        if (!existsSync(join(dir, f))) add("error", dir, `falta ${f}`);
      }
      for (const s of STAGES) {
        if (!existsSync(join(dir, s, "CONTEXT.md")))
          add("error", dir, `falta ${s}/CONTEXT.md`);
      }
      const evento = join(dir, "EVENTO.md");
      if (existsSync(evento)) {
        const fm = parseFrontmatter(readFileSync(evento, "utf8"));
        for (const k of ["id", "fecha", "estado", "modelo"]) {
          if (!fm?.[k]) add("error", evento, `falta frontmatter: ${k}`);
        }
        if (fm?.id && fm.id !== d.name)
          add(
            "error",
            evento,
            `id "${fm.id}" no coincide con la carpeta "${d.name}"`,
          );
        if (typeof fm?.fecha === "string" && !d.name.startsWith(fm.fecha)) {
          add(
            "error",
            evento,
            `la carpeta no empieza con la fecha ${fm.fecha}`,
          );
        }
      }
    }
  }

  // Task tables: parse errors, duplicate ids, variant references.
  const playbook = join(root, "_playbook");
  if (existsSync(join(playbook, "pilares"))) {
    try {
      const tasks = loadAllTasks(playbook);
      for (const id of duplicateIds(tasks))
        add("error", playbook, `id de tarea duplicado: ${id}`);
      const known = new Set(tasks.map((t) => t.id));
      const variantsDir = join(playbook, "variantes");
      if (existsSync(variantsDir)) {
        for (const v of readdirSync(variantsDir).filter((n) =>
          n.endsWith(".md"),
        )) {
          const file = join(variantsDir, v);
          for (const id of parseConditionals(
            readFileSync(file, "utf8"),
          ).keys()) {
            if (!known.has(id))
              add(
                "error",
                file,
                `la variante cita una tarea inexistente: ${id}`,
              );
          }
        }
      }
    } catch (e) {
      add("error", playbook, (e as Error).message);
    }
  }

  // Privacy: nothing under a private/ folder may be tracked by git.
  if (existsSync(join(root, ".git"))) {
    try {
      const tracked = execFileSync("git", ["ls-files"], {
        cwd: root,
        encoding: "utf8",
      }).split("\n");
      for (const f of tracked) {
        if (
          /(^|\/)private\//.test(f) ||
          /\.private\.md$/.test(f) ||
          f.startsWith("_private/")
        ) {
          add("error", join(root, f), "archivo privado versionado en git");
        }
      }
    } catch {
      add(
        "warn",
        root,
        "no se pudo consultar git para la revisión de privacidad",
      );
    }
  }

  return issues;
}
