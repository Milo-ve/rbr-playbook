import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDashboardData } from "./lib/dashboard-data";
import { today } from "./lib/dates";
import { shouldPublish } from "./lib/publish";
import { HEADERS, renderSite } from "./lib/site";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generado = today();
const { publish, reason } = shouldPublish(process.env);

try {
  const html = renderSite(buildDashboardData(root, generado), {
    generado,
    publish,
  });
  const out = resolve(root, "dist", "site");
  mkdirSync(out, { recursive: true });
  writeFileSync(resolve(out, "index.html"), html);
  writeFileSync(resolve(out, "_headers"), HEADERS);
  console.log(
    publish
      ? `Sitio generado en dist/site (con datos, al ${generado}; ${reason}).`
      : `Sitio generado en dist/site SIN datos (${reason}): solo la página "en preparación".`,
  );
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
