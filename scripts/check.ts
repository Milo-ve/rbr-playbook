import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runChecks } from "./lib/check";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const issues = runChecks(root);

for (const i of issues)
  console.log(
    `${i.level === "error" ? "ERROR" : "AVISO"}  ${i.file}: ${i.message}`,
  );

const errors = issues.filter((i) => i.level === "error").length;
console.log(errors === 0 ? "OK: 0 errores." : `${errors} error(es).`);
process.exit(errors === 0 ? 0 : 1);
