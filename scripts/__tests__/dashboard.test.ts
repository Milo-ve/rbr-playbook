import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { hasMoneyAmount, runChecks } from "../lib/check";
import { buildDashboardData } from "../lib/dashboard-data";
import { findTable, parseTables, stripMd } from "../lib/md-table";
import { stampEvent } from "../lib/stamp";
import { markTask } from "../lib/mark";
import { readFileSync } from "node:fs";

const REAL = resolve(__dirname, "..", "..");

describe("md-table", () => {
  const md = [
    "| Sponsor | Perk | Nota |",
    "| --- | --- | --- |",
    "| Intercom | **100%** off \\| año uno | [sitio](https://x.com) `código` |",
    "| Zillow | vacantes | |",
    "",
    "texto",
    "",
    "| A | B |",
    "|---|---|",
    "| 1 | 2 |",
  ].join("\n");
  it("reads several tables keyed by header", () => {
    const t = parseTables(md);
    expect(t).toHaveLength(2);
    expect(t[0]?.rows[0]).toEqual({ Sponsor: "Intercom", Perk: "100% off | año uno", Nota: "sitio código" });
    expect(t[0]?.rows[1]?.Nota).toBe("");
  });
  it("finds a table by its headers", () => {
    expect(findTable(parseTables(md), "A", "B")?.rows).toEqual([{ A: "1", B: "2" }]);
    expect(findTable(parseTables(md), "Nope")).toBeUndefined();
  });
  it("strips markdown", () => {
    expect(stripMd("**a** [b](c) `d`")).toBe("a b d");
  });
});

describe("hasMoneyAmount", () => {
  it("detects amounts but not percentages or plain numbers", () => {
    expect(hasMoneyAmount("monto $1,200")).toBe(true);
    expect(hasMoneyAmount("USD 500")).toBe(true);
    expect(hasMoneyAmount("10000 MXN")).toBe(true);
    expect(hasMoneyAmount("100% de descuento, 50% el segundo")).toBe(false);
    expect(hasMoneyAmount("hay 4 sponsors")).toBe(false);
  });
});

describe("buildDashboardData", () => {
  let root: string;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "rbr-dash-"));
    cpSync(join(REAL, "_playbook"), join(root, "_playbook"), { recursive: true });
    cpSync(join(REAL, "_templates"), join(root, "_templates"), { recursive: true });
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  const slp = () =>
    stampEvent({
      root, city: "San Luis Potosí", code: "SLP", date: "2026-11-28", currency: "MXN",
      newCity: true, model: "community-led", state: "confirmed", today: "2026-10-24",
    });

  it("reads event, tasks, stages, sponsors and team", () => {
    const r = slp();
    const f = join(r.dir, "tareas-del-evento.md");
    writeFileSync(f, markTask(readFileSync(f, "utf8"), "T052", "hecha", "2026-10-24 ok"));
    mkdirSync(join(r.dir, "00_alta", "output"), { recursive: true });
    writeFileSync(
      join(r.dir, "00_alta", "output", "roles.md"),
      "| Rol | Persona | Confirmado | Fuente |\n|---|---|---|---|\n| `mc` (host) | Milo | sí | x |\n",
    );
    writeFileSync(
      join(r.dir, "03_sponsors", "output", "sponsors.md"),
      [
        "| Sponsor | Qué es | Estado comercial | Etapa | Logo |",
        "|---|---|---|---|---|",
        "| Zillow | x | confirmed | Cerrada | sí |",
        "",
        "| Sponsor | Perk | Cómo |",
        "|---|---|---|",
        "| Zillow | Vacantes (Milo, 2026-10-24) | QR |",
      ].join("\n"),
    );
    const d = buildDashboardData(root, "2026-10-24");
    expect(d.eventos).toHaveLength(1);
    expect(d.eventos[0]).toMatchObject({ event_id: "2026-11-28-SLP", estado: "confirmed", ciudad_nueva: "sí", generado: "2026-10-24" });
    expect(d.tareas).toHaveLength(r.taskCount);
    expect(d.tareas.find((t) => t.id === "T052")).toMatchObject({ estado: "hecha", rol: "ops_central" });
    expect(d.tareas.find((t) => t.id === "T016")?.fecha).toBe("");
    expect(d.etapas).toHaveLength(7);
    expect(d.etapas.find((e) => e.etapa === "00")).toMatchObject({ archivos: 1, con_salida: "sí" });
    expect(d.etapas.find((e) => e.etapa === "06")).toMatchObject({ archivos: 0, con_salida: "no" });
    expect(d.sponsors).toEqual([
      { event_id: "2026-11-28-SLP", sponsor: "Zillow", estado_comercial: "confirmed", etapa: "Cerrada", perk: "Vacantes", logo: "sí" },
    ]);
    expect(d.equipo).toEqual([{ event_id: "2026-11-28-SLP", rol: "mc", persona: "Milo", confirmado: "sí" }]);
  });

  it("never reads private folders", () => {
    const r = slp();
    mkdirSync(join(r.dir, "03_sponsors", "private"), { recursive: true });
    writeFileSync(join(r.dir, "03_sponsors", "private", "deals.md"), "| Sponsor | Estado comercial |\n|---|---|\n| SENTINEL-99999 | $99,999 |\n");
    writeFileSync(join(r.dir, "06_cierre", "private.md"), "SENTINEL-99999");
    const json = JSON.stringify(buildDashboardData(root, "2026-10-24"));
    expect(json).not.toContain("SENTINEL");
    expect(json).not.toContain("99,999");
  });

  it("returns empty datasets when there are no events", () => {
    expect(buildDashboardData(root, "2026-10-24")).toEqual({ eventos: [], tareas: [], etapas: [], sponsors: [], equipo: [] });
  });
});

describe("check: money in tracked sponsor files", () => {
  it("warns when an amount appears in 03_sponsors/output", () => {
    const root = mkdtempSync(join(tmpdir(), "rbr-money-"));
    try {
      cpSync(join(REAL, "_playbook"), join(root, "_playbook"), { recursive: true });
      cpSync(join(REAL, "_templates"), join(root, "_templates"), { recursive: true });
      const r = stampEvent({ root, city: "X", code: "XXX", date: "2027-01-10", currency: "MXN", newCity: true, model: "estandar", today: "2026-10-24" });
      writeFileSync(join(r.dir, "03_sponsors", "output", "sponsors.md"), "Zillow pagó $5,000 MXN");
      expect(runChecks(root).some((i) => i.level === "warn" && i.message.includes("monto"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("the real repo", () => {
  it("produces a dashboard dataset for SLP with no amounts in sponsor rows", () => {
    const d = buildDashboardData(REAL, "2026-10-24");
    const slp = d.eventos.find((e) => e.event_id === "2026-11-28-SLP");
    expect(slp).toBeDefined();
    expect(d.tareas.filter((t) => t.event_id === "2026-11-28-SLP").length).toBeGreaterThan(80);
    expect(d.sponsors.map((s) => s.sponsor)).toEqual(expect.arrayContaining(["Zillow", "Intercom", "Improvitz", "Vravura"]));
    expect(hasMoneyAmount(JSON.stringify(d.sponsors))).toBe(false);
  });
});

describe("check: money in the tracked budget folder", () => {
  it("warns when an amount appears in 01_presupuesto/output", () => {
    const root = mkdtempSync(join(tmpdir(), "rbr-budget-"));
    try {
      cpSync(join(REAL, "_playbook"), join(root, "_playbook"), { recursive: true });
      cpSync(join(REAL, "_templates"), join(root, "_templates"), { recursive: true });
      const r = stampEvent({ root, city: "X", code: "XXX", date: "2027-01-10", currency: "MXN", newCity: true, model: "estandar", today: "2026-10-24" });
      writeFileSync(join(r.dir, "01_presupuesto", "output", "estado.md"), "Catering: 12000 MXN");
      expect(runChecks(root).some((i) => i.level === "warn" && i.message.includes("monto"))).toBe(true);
      writeFileSync(join(r.dir, "01_presupuesto", "output", "estado.md"), "Estado: borrador. Falta la cotización de catering.");
      expect(runChecks(root).some((i) => i.message.includes("monto"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
