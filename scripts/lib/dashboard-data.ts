import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter";
import { MARKS } from "./mark";
import { findTable, parseTables, stripMd } from "./md-table";

export type Row = Record<string, string | number | null>;

export interface DashboardData {
  eventos: Row[];
  tareas: Row[];
  etapas: Row[];
  sponsors: Row[];
  equipo: Row[];
}

const STAGE = /^\d{2}_/;

/** Number of real files an event stage has produced (ignores .gitkeep). */
function countOutputFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".gitkeep") continue;
    n += e.isDirectory() ? countOutputFiles(join(dir, e.name)) : 1;
  }
  return n;
}

function read(file: string): string | null {
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

const markToState = Object.fromEntries(
  Object.entries(MARKS).map(([k, v]) => [v, k]),
) as Record<string, string>;

/**
 * Builds the dashboard datasets from the tracked event files.
 * It only ever opens `output/` files and EVENTO.md: `private/` folders are never read,
 * so amounts, invoices and exports cannot reach the dashboard.
 */
export function buildDashboardData(
  root: string,
  generado: string,
): DashboardData {
  const data: DashboardData = {
    eventos: [],
    tareas: [],
    etapas: [],
    sponsors: [],
    equipo: [],
  };
  const eventsDir = join(root, "eventos");
  if (!existsSync(eventsDir)) return data;

  const ids = readdirSync(eventsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const id of ids) {
    const dir = join(eventsDir, id);
    const evento = read(join(dir, "EVENTO.md"));
    if (evento === null) continue;

    const fm = parseFrontmatter(evento) ?? {};
    const fichaTable = findTable(parseTables(evento), "Campo", "Valor");
    const ficha = new Map(
      (fichaTable?.rows ?? []).map((r) => [r["Campo"] ?? "", r["Valor"] ?? ""]),
    );
    const goal = Number(fm.meta_asistentes);
    data.eventos.push({
      event_id: id,
      ciudad: String(fm.ciudad ?? ""),
      fecha: String(fm.fecha ?? ""),
      estado: String(fm.estado ?? ""),
      modelo: String(fm.modelo ?? ""),
      ciudad_nueva: fm.ciudad_nueva === true ? "sí" : "no",
      meta_asistentes:
        Number.isFinite(goal) && fm.meta_asistentes !== null ? goal : null,
      moneda_local: String(fm.moneda_local ?? ""),
      precio: ficha.get("Precio del boleto") ?? "",
      horario: ficha.get("Horario") ?? "",
            venue: (ficha.get("Venue") ?? "").split(/\sVer\s/)[0]?.trim().replace(/\.$/, "") ?? "",
      generado,
    });

    const tareas = read(join(dir, "tareas-del-evento.md"));
    const tTable = tareas
      ? findTable(parseTables(tareas), "Hecho", "ID", "Tarea")
      : undefined;
    for (const r of tTable?.rows ?? []) {
      const fecha = r["Fecha"] ?? "";
      data.tareas.push({
        event_id: id,
        id: r["ID"] ?? "",
        tarea: r["Tarea"] ?? "",
        fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : "",
        rol: r["Rol"] ?? "",
        pilar: r["Pilar"] ?? "",
        estado: markToState[r["Hecho"] ?? ""] ?? "pendiente",
        nota: r["Nota"] ?? "",
      });
    }

    for (const stage of readdirSync(dir)
      .filter((n) => STAGE.test(n))
      .sort()) {
      const files = countOutputFiles(join(dir, stage, "output"));
      data.etapas.push({
        event_id: id,
        etapa: stage.slice(0, 2),
        nombre: stage.slice(3),
        archivos: files,
        con_salida: files > 0 ? "sí" : "no",
      });
    }

    const sponsors = read(join(dir, "03_sponsors", "output", "sponsors.md"));
    if (sponsors) {
      const tables = parseTables(sponsors);
      const main = findTable(tables, "Sponsor", "Estado comercial");
      const perks = new Map(
        (findTable(tables, "Sponsor", "Perk")?.rows ?? []).map((r) => [
          r["Sponsor"] ?? "",
          r["Perk"] ?? "",
        ]),
      );
      for (const r of main?.rows ?? []) {
        const name = r["Sponsor"] ?? "";
        data.sponsors.push({
          event_id: id,
          sponsor: name,
          estado_comercial: r["Estado comercial"] ?? "",
          etapa: r["Etapa"] ?? "",
          perk: (perks.get(name) ?? "")
            .replace(/\s*\(Milo[^)]*\)/g, "")
            .replace(/\.\s*Milo lo describió[^.]*\.?/g, "")
            .trim(),
          logo: r["Logo"] ?? "",
        });
      }
    }

    const roles = read(join(dir, "00_alta", "output", "roles.md"));
    const rTable = roles
      ? findTable(parseTables(roles), "Rol", "Persona", "Confirmado")
      : undefined;
    for (const r of rTable?.rows ?? []) {
      data.equipo.push({
        event_id: id,
        rol: stripMd((r["Rol"] ?? "").replace(/\s*\(.*\)$/, "")),
        persona: r["Persona"] ?? "",
        confirmado: r["Confirmado"] ?? "",
      });
    }
  }
  return data;
}

