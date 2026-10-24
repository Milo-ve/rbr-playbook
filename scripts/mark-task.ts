import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { MARKS, markTask, summarize, type MarkName } from "./lib/mark";
import { today } from "./lib/dates";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    evento: { type: "string" },
    estado: { type: "string" },
    nota: { type: "string" },
  },
});

const names = Object.keys(MARKS).join("|");
if (!values.evento || !values.estado || positionals.length === 0) {
  console.log(
    `Uso: npm run mark -- --evento 2026-11-28-SLP --estado ${names} [--nota "texto"] T001 T002 ...`,
  );
  process.exit(1);
}
if (!(values.estado in MARKS)) {
  console.error(`Estado inválido: ${values.estado}. Usa: ${names}`);
  process.exit(1);
}

const file = resolve(root, "eventos", values.evento, "tareas-del-evento.md");
try {
  let text = readFileSync(file, "utf8");
  const note = values.nota ? `${today()} ${values.nota}` : undefined;
  for (const id of positionals)
    text = markTask(text, id, values.estado as MarkName, note);
  writeFileSync(file, text);
  const s = summarize(text);
  console.log(
    `${positionals.length} tarea(s) → ${values.estado}. Hechas ${s.hecha} · en curso ${s["en-curso"]} · no aplican ${s["no-aplica"]} · pendientes ${s.pendiente}`,
  );
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
