import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIndex } from "./lib/index-builder";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(resolve(root, "_index"), { recursive: true });
writeFileSync(resolve(root, "_index", "eventos.md"), buildIndex(root));
console.log("Índice reconstruido: _index/eventos.md");
