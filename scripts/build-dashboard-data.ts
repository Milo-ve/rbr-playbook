import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { buildDashboardData } from "./lib/dashboard-data";
import { today } from "./lib/dates";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { values } = parseArgs({ options: { hoy: { type: "string" } } });
const generado = values.hoy ?? today();

const data = buildDashboardData(root, generado);
const out = resolve(root, "dist", "dashboard");
mkdirSync(out, { recursive: true });
for (const [name, rows] of Object.entries(data)) {
  writeFileSync(resolve(out, `${name}.json`), JSON.stringify(rows, null, 1));
  console.log(`${name}.json: ${rows.length} filas`);
}
console.log(`Datos del tablero generados en dist/dashboard (al ${generado}).`);
