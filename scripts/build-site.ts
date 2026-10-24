import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDashboardData } from "./lib/dashboard-data";
import { today } from "./lib/dates";
import { HEADERS, renderSite } from "./lib/site";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generado = today();
// The page carries data only when SITE_PUBLISH is exactly "1". Set it once access control is on.
const publish = process.env.SITE_PUBLISH === "1";

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
      ? `Sitio generado en dist/site (con datos, al ${generado}).`
      : 'Sitio generado en dist/site SIN datos (SITE_PUBLISH no es 1): solo la página "en preparación".',
  );
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
