import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter";

const STAGE = /^\d{2}_/;

/** A stage has progress when its output/ holds anything besides .gitkeep. */
export function stagesWithOutput(eventDir: string): string[] {
  return readdirSync(eventDir)
    .filter((n) => STAGE.test(n))
    .sort()
    .filter((n) => {
      const out = join(eventDir, n, "output");
      return existsSync(out) && readdirSync(out).some((f) => f !== ".gitkeep");
    })
    .map((n) => n.slice(0, 2));
}

/** Rebuilds the event index from each EVENTO.md and its output folders. */
export function buildIndex(root: string): string {
  const eventsDir = join(root, "eventos");
  const ids = existsSync(eventsDir)
    ? readdirSync(eventsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
    : [];
  const rows = ids.map((id) => {
    const file = join(eventsDir, id, "EVENTO.md");
    const fm = existsSync(file)
      ? parseFrontmatter(readFileSync(file, "utf8"))
      : null;
    const stages = stagesWithOutput(join(eventsDir, id));
    return `| [${id}](../eventos/${id}/CLAUDE.md) | ${fm?.ciudad ?? "—"} | ${fm?.fecha ?? "—"} | ${fm?.estado ?? "—"} | ${fm?.modelo ?? "—"} | ${stages.length ? stages.join(" ") : "—"} |`;
  });
  return [
    "<!-- GENERADO por scripts/build-index.ts. No editar a mano: se reescribe. -->",
    "",
    "# Eventos",
    "",
    "Etapas con salida = números de las etapas cuyo `output/` ya tiene archivos.",
    "",
    "| Evento | Ciudad | Fecha | Estado | Modelo | Etapas con salida |",
    "|---|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}
