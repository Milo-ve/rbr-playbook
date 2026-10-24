import { describe, expect, it } from "vitest";
import { markTask, summarize } from "../lib/mark";

const table = [
  "| Hecho | ID | Tarea | Fecha | Rol | Pilar | Nota |",
  "|---|---|---|---|---|---|---|",
  "| [ ] | T001 | Confirmar fecha | 2026-10-03 | ops_central | adquisicion |  |",
  "| [ ] | T036 | Pagar venue | 2026-11-21 | ops_central | operaciones | condicional: sin costo (por confirmar) |",
  "| [ ] | T052 | Asignar MC y OOS | 2026-10-17 | ops_central | operaciones |  |",
].join("\n");

describe("markTask", () => {
  it("changes only the targeted row", () => {
    const out = markTask(table, "T052", "hecha");
    expect(out).toContain("| [x] | T052 |");
    expect(out).toContain("| [ ] | T001 |");
    expect(summarize(out).hecha).toBe(1);
  });
  it("adds a note to an empty Nota cell", () => {
    const out = markTask(table, "T001", "hecha", "2026-10-24 página publicada");
    expect(out).toMatch(/\| \[x\] \| T001 \|.*\| 2026-10-24 página publicada \|$/m);
  });
  it("appends to an existing note instead of replacing it", () => {
    const out = markTask(table, "T036", "no-aplica", "venue gratis");
    expect(out).toContain("condicional: sin costo (por confirmar) · venue gratis |");
    expect(out).toContain("| [-] | T036 |");
  });
  it("escapes pipes in notes so the table stays intact", () => {
    const out = markTask(table, "T001", "en-curso", "a | b");
    expect(out).toContain("a \\| b |");
    expect(out).toContain("| [~] | T001 |");
  });
  it("throws on an unknown task id", () => {
    expect(() => markTask(table, "T999", "hecha")).toThrow(/T999/);
  });
  it("counts every state", () => {
    let t = markTask(table, "T001", "hecha");
    t = markTask(t, "T036", "no-aplica");
    t = markTask(t, "T052", "en-curso");
    expect(summarize(t)).toEqual({ pendiente: 0, "en-curso": 1, hecha: 1, "no-aplica": 1 });
  });
});
