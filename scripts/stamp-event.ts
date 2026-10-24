import { parseArgs } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CURRENCIES, MODELS, STATES, stampEvent } from "./lib/stamp";
import { buildIndex } from "./lib/index-builder";
import { mkdirSync, writeFileSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const { values } = parseArgs({
  options: {
    ciudad: { type: "string" },
    codigo: { type: "string" },
    fecha: { type: "string" },
    moneda: { type: "string" },
    modelo: { type: "string", default: "estandar" },
    estado: { type: "string", default: "tentative" },
    "ciudad-nueva": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

if (
  values.help ||
  !values.ciudad ||
  !values.codigo ||
  !values.fecha ||
  !values.moneda
) {
  console.log(`Uso: npm run stamp -- --ciudad "San Luis Potosí" --codigo SLP --fecha 2026-11-28 --moneda MXN [--ciudad-nueva] [--modelo ${MODELS.join("|")}] [--estado ${STATES.join("|")}]
Monedas: ${CURRENCIES.join(", ")}`);
  process.exit(values.help ? 0 : 1);
}

try {
  const result = stampEvent({
    root,
    city: values.ciudad,
    code: values.codigo,
    date: values.fecha,
    currency: values.moneda as (typeof CURRENCIES)[number],
    newCity: values["ciudad-nueva"] ?? false,
    model: values.modelo as (typeof MODELS)[number],
    state: values.estado as (typeof STATES)[number],
  });
  mkdirSync(resolve(root, "_index"), { recursive: true });
  writeFileSync(resolve(root, "_index", "eventos.md"), buildIndex(root));
  console.log(
    `Evento creado: eventos/${result.id} (${result.taskCount} tareas). Índice actualizado.`,
  );
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
