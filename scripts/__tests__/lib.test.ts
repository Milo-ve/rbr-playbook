import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { addDays, isIsoDate } from "../lib/dates";
import { parseFrontmatter } from "../lib/frontmatter";
import { buildEventTasks } from "../lib/plan";
import { duplicateIds, loadAllTasks, parseTasks } from "../lib/tasks";
import { parseConditionals } from "../lib/variant";

const ROOT = resolve(__dirname, "..", "..");

describe("dates", () => {
  it("adds and subtracts days across month and year boundaries", () => {
    expect(addDays("2026-11-28", -35)).toBe("2026-10-24");
    expect(addDays("2026-11-28", 14)).toBe("2026-12-12");
    expect(addDays("2026-12-30", 5)).toBe("2027-01-04");
  });
  it("is not shifted by daylight saving changes", () => {
    expect(addDays("2026-03-08", 1)).toBe("2026-03-09");
    expect(addDays("2026-11-01", -1)).toBe("2026-10-31");
  });
  it("rejects impossible dates", () => {
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("26-02-01")).toBe(false);
    expect(() => addDays("nope", 1)).toThrow();
  });
});

describe("frontmatter", () => {
  it("reads scalars, booleans, quotes and empty values", () => {
    const fm = parseFrontmatter(
      '---\nid: "2026-11-28-SLP"\nnueva: true\nmeta:\nfecha: 2026-11-28\n---\n# x',
    );
    expect(fm).toEqual({
      id: "2026-11-28-SLP",
      nueva: true,
      meta: null,
      fecha: "2026-11-28",
    });
  });
  it("returns null without a block", () => {
    expect(parseFrontmatter("# sin bloque")).toBeNull();
  });
});

describe("parseTasks", () => {
  const md = [
    "| ID | Tarea | Días | Rol | Fase | Condición |",
    "|---|---|---:|---|---|---|",
    "| T001 | Confirmar fecha | -56 | ops_central | pre | |",
    "| T016 | Registrar deal | — | partnerships | pre | |",
    "| T013 | Contactos directos | -28 | partnerships | pre | ciudad-nueva |",
    "| T047 | Pedidos Comebien | -4 | ops_central | pre | ciudad:CDMX |",
    "| T088 | Correo post | 3 | partnerships | post |",
  ].join("\n");

  it("parses rows regardless of column alignment", () => {
    const t = parseTasks(md, "x");
    expect(t.map((r) => r.id)).toEqual([
      "T001",
      "T016",
      "T013",
      "T047",
      "T088",
    ]);
    expect(t[0]).toMatchObject({
      days: -56,
      role: "ops_central",
      phase: "pre",
      condition: "",
    });
    expect(t[1]?.days).toBeNull();
    expect(t[4]?.condition).toBe("");
  });
  it("rejects bad roles, phases, days and conditions", () => {
    expect(() => parseTasks("| T001 | x | -1 | jefe | pre | |", "x")).toThrow(
      /rol/,
    );
    expect(() => parseTasks("| T001 | x | -1 | oos | tarde | |", "x")).toThrow(
      /fase/,
    );
    expect(() =>
      parseTasks("| T001 | x | pronto | oos | pre | |", "x"),
    ).toThrow(/Días/);
    expect(() =>
      parseTasks("| T001 | x | -1 | oos | pre | raro |", "x"),
    ).toThrow(/condición/);
  });
});

describe("real playbook task tables", () => {
  const tasks = loadAllTasks(resolve(ROOT, "_playbook"));
  it("has the 94 active templates with no duplicate ids", () => {
    expect(tasks).toHaveLength(94);
    expect(duplicateIds(tasks)).toEqual([]);
  });
  it("splits 76 pre / 2 dia / 16 post", () => {
    const by = (p: string) => tasks.filter((t) => t.phase === p).length;
    expect([by("pre"), by("dia"), by("post")]).toEqual([76, 2, 16]);
  });
  it("flags the four new-city-only tasks", () => {
    expect(
      tasks
        .filter((t) => t.condition === "ciudad-nueva")
        .map((t) => t.id)
        .sort(),
    ).toEqual(["T013", "T029", "T030", "T051"]);
  });
});

describe("buildEventTasks", () => {
  const templates = loadAllTasks(resolve(ROOT, "_playbook"));
  const base = {
    date: "2026-11-28",
    code: "SLP",
    newCity: true,
    conditionals: new Map<string, string>(),
    today: "2026-10-24",
  };

  it("computes due dates from the event date", () => {
    const t = buildEventTasks(templates, base);
    expect(t.find((x) => x.id === "T001")?.due).toBe("2026-10-03");
    expect(t.find((x) => x.id === "T100")?.due).toBe("2026-12-12");
    expect(t.find((x) => x.id === "T016")?.due).toBeNull();
  });
  it("drops new-city tasks for an existing city", () => {
    const t = buildEventTasks(templates, { ...base, newCity: false });
    expect(t.some((x) => x.id === "T029")).toBe(false);
  });
  it("generates T047 only for CDMX", () => {
    expect(buildEventTasks(templates, base).some((x) => x.id === "T047")).toBe(
      false,
    );
    expect(
      buildEventTasks(templates, { ...base, code: "CDMX" }).some(
        (x) => x.id === "T047",
      ),
    ).toBe(true);
  });
  it("gives past or same-day events only post tasks", () => {
    const t = buildEventTasks(templates, { ...base, date: "2026-10-24" });
    expect(t.length).toBeGreaterThan(0);
    expect(t.every((x) => x.phase === "post")).toBe(true);
  });
  it("annotates conditional tasks and sorts undated last", () => {
    const t = buildEventTasks(templates, {
      ...base,
      conditionals: new Map([["T036", "Venue sin costo"]]),
    });
    expect(t.find((x) => x.id === "T036")?.note).toContain("Venue sin costo");
    expect(t[t.length - 1]?.due).toBeNull();
  });
});

describe("community-led variant", () => {
  it("lists conditional tasks that all exist in the playbook", async () => {
    const { readFileSync } = await import("node:fs");
    const map = parseConditionals(
      readFileSync(
        resolve(ROOT, "_playbook/variantes/community-led.md"),
        "utf8",
      ),
    );
    const known = new Set(
      loadAllTasks(resolve(ROOT, "_playbook")).map((t) => t.id),
    );
    expect(map.size).toBe(9);
    for (const id of map.keys()) expect(known.has(id)).toBe(true);
  });
});
