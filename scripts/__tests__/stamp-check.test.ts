import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { buildIndex } from "../lib/index-builder";
import { parseFrontmatter } from "../lib/frontmatter";
import {
  extractInputPaths,
  extractLinks,
  isFuturePath,
  lineCount,
  missingSections,
  runChecks,
} from "../lib/check";
import { stampEvent } from "../lib/stamp";

const REAL = resolve(__dirname, "..", "..");
let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "rbr-"));
  cpSync(join(REAL, "_playbook"), join(root, "_playbook"), { recursive: true });
  cpSync(join(REAL, "_templates"), join(root, "_templates"), {
    recursive: true,
  });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

const slp = (over = {}) => ({
  root,
  city: "San Luis Potosí",
  code: "SLP",
  date: "2026-11-28",
  currency: "MXN" as const,
  newCity: true,
  model: "community-led" as const,
  today: "2026-10-24",
  ...over,
});

describe("stampEvent", () => {
  it("creates the event folder, fills placeholders and generates tasks", () => {
    const r = stampEvent(slp());
    expect(r.id).toBe("2026-11-28-SLP");
    const evento = readFileSync(join(r.dir, "EVENTO.md"), "utf8");
    expect(evento).toContain('id: "2026-11-28-SLP"');
    expect(evento).toContain("modelo: community-led");
    expect(evento).toContain("ciudad_nueva: true");
    expect(evento).not.toContain("{{");
    const tareas = readFileSync(join(r.dir, "tareas-del-evento.md"), "utf8");
    expect(tareas).toContain(`total: ${r.taskCount}`);
    expect(tareas).toContain("condicional: Venue sin costo");
    expect(existsSync(join(r.dir, "06_cierre", "output", ".gitkeep"))).toBe(
      true,
    );
  });
  it("keeps the template placeholders intact and writes bare scalars", () => {
    const template = readFileSync(
      join(REAL, "_templates", "evento", "EVENTO.md"),
      "utf8",
    );
    // A YAML-aware formatter once rewrote unquoted {{x}} into "{ { x } }".
    expect(template).not.toMatch(/\{ \{/);
    const r = stampEvent(slp());
    const fm = parseFrontmatter(readFileSync(join(r.dir, "EVENTO.md"), "utf8"));
    expect(fm).toMatchObject({
      fecha: "2026-11-28",
      ciudad_nueva: true,
      modelo: "community-led",
    });
  });
  it("refuses to overwrite an existing event", () => {
    stampEvent(slp());
    expect(() => stampEvent(slp())).toThrow(/ya existe/);
  });
  it("rejects bad input before touching the disk", () => {
    expect(() => stampEvent(slp({ date: "2026-13-01" }))).toThrow(/Fecha/);
    expect(() => stampEvent(slp({ code: "slp" }))).toThrow(/Código/);
    expect(() => stampEvent(slp({ currency: "EUR" }))).toThrow(/Moneda/);
    expect(existsSync(join(root, "eventos"))).toBe(false);
  });
  it("applies the estado override", () => {
    const r = stampEvent(slp({ state: "confirmed" }));
    expect(readFileSync(join(r.dir, "EVENTO.md"), "utf8")).toContain(
      "estado: confirmed",
    );
  });
});

describe("buildIndex", () => {
  it("lists events and the stages that have output", () => {
    const r = stampEvent(slp());
    expect(buildIndex(root)).toContain("| — |");
    writeFileSync(
      join(r.dir, "02_adquisicion", "output", "materiales.md"),
      "# x",
    );
    const idx = buildIndex(root);
    expect(idx).toContain("2026-11-28-SLP");
    expect(idx).toContain("| 02 |");
    expect(idx).toContain("GENERADO");
  });
});

describe("check helpers", () => {
  it("extracts relative links only", () => {
    expect(
      extractLinks("[a](x.md) [b](https://x.com) [c](#top) [d](y.md#sec)"),
    ).toEqual(["x.md", "y.md"]);
  });
  it("extracts contract input paths", () => {
    const md =
      "- Working (este evento): ../EVENTO.md\n- Reference (siempre): ../../a.md\n- otra cosa: nope";
    expect(extractInputPaths(md)).toEqual(["../EVENTO.md", "../../a.md"]);
  });
  it("treats outputs, private folders and the generated task list as future paths", () => {
    expect(isFuturePath("../03_sponsors/output/sponsors.md")).toBe(true);
    expect(isFuturePath("private/")).toBe(true);
    expect(isFuturePath("../tareas-del-evento.md")).toBe(true);
    expect(isFuturePath("../EVENTO.md")).toBe(false);
  });
  it("finds missing contract sections", () => {
    expect(
      missingSections(
        "One job: x\n## Inputs\n## Process\n## Outputs\n## Human check\n",
      ),
    ).toEqual([]);
    expect(missingSections("## Inputs\n")).toEqual([
      "## Process",
      "## Outputs",
      "## Human check",
      "One job:",
    ]);
  });
  it("counts lines", () => {
    expect(lineCount("a\nb\nc\n")).toBe(3);
  });
});

describe("runChecks", () => {
  it("passes on a freshly stamped workspace", () => {
    stampEvent(slp());
    const errors = runChecks(root).filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });
  it("flags a broken link, an oversized entry file and an incomplete contract", () => {
    const r = stampEvent(slp());
    writeFileSync(join(root, "_playbook", "rota.md"), "[x](no-existe.md)");
    writeFileSync(
      join(root, "CLAUDE.md"),
      Array.from({ length: 70 }, () => "l").join("\n"),
    );
    writeFileSync(
      join(r.dir, "03_sponsors", "CONTEXT.md"),
      "One job: x\n## Inputs\n",
    );
    const msgs = runChecks(root).map((i) => i.message);
    expect(msgs.some((m) => m.includes("enlace roto: no-existe.md"))).toBe(
      true,
    );
    expect(msgs.some((m) => m.includes("70 líneas"))).toBe(true);
    expect(
      msgs.some((m) => m.includes("al contrato le falta: ## Process")),
    ).toBe(true);
  });
  it("flags a missing input path in a contract", () => {
    const r = stampEvent(slp());
    const file = join(r.dir, "01_presupuesto", "CONTEXT.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8") +
        "\n- Reference (siempre): ../../../_playbook/no-existe.md\n",
    );
    expect(
      runChecks(root).some((i) => i.message.includes("entrada inexistente")),
    ).toBe(true);
  });
  it("flags an event whose folder disagrees with its card", () => {
    const r = stampEvent(slp());
    const file = join(r.dir, "EVENTO.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace("2026-11-28-SLP", "2026-11-28-XXX"),
    );
    expect(
      runChecks(root).some((i) =>
        i.message.includes("no coincide con la carpeta"),
      ),
    ).toBe(true);
  });
  it("flags a duplicate task id", () => {
    mkdirSync(join(root, "_playbook", "pilares", "extra"), { recursive: true });
    writeFileSync(
      join(root, "_playbook", "pilares", "extra", "tareas.md"),
      "| T001 | duplicada | -1 | oos | pre | |\n",
    );
    expect(
      runChecks(root).some((i) => i.message.includes("duplicado: T001")),
    ).toBe(true);
  });
});
