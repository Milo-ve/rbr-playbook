import { describe, expect, it } from "vitest";
import { JSDOM, VirtualConsole } from "jsdom";
import { resolve } from "node:path";
import { buildDashboardData, type DashboardData } from "../lib/dashboard-data";
import { findLeaks, renderSite, sanitize } from "../lib/site";

const REAL = resolve(__dirname, "..", "..");

const task = (
  id: string,
  fecha: string,
  rol: string,
  estado: string,
  extra = {},
) => ({
  event_id: "2026-11-28-SLP",
  id,
  tarea: "Tarea " + id,
  fecha,
  rol,
  pilar: "operaciones",
  estado,
  nota: "",
  ...extra,
});

const fixture = (): DashboardData => ({
  eventos: [
    {
      event_id: "2026-11-28-SLP",
      ciudad: "San Luis Potosí",
      fecha: "2026-11-28",
      estado: "confirmed",
      modelo: "community-led",
      ciudad_nueva: "sí",
      meta_asistentes: 45,
      moneda_local: "MXN",
      precio: "$500 MXN",
      horario: "09:30 apertura",
      venue: "Parque",
      generado: "2026-10-24",
    },
  ],
  tareas: [
    task("T001", "2026-10-03", "ops_central", "hecha"),
    task("T002", "2026-10-10", "ops_central", "en-curso"),
    task("T003", "2026-10-24", "mc", "pendiente"),
    task("T004", "2026-10-28", "oos", "pendiente"),
    task("T005", "2026-12-20", "mc", "pendiente"),
    task("T006", "", "partnerships", "pendiente"),
  ],
  etapas: [
    {
      event_id: "2026-11-28-SLP",
      etapa: "00",
      nombre: "alta",
      archivos: 1,
      con_salida: "sí",
    },
    {
      event_id: "2026-11-28-SLP",
      etapa: "06",
      nombre: "cierre",
      archivos: 0,
      con_salida: "no",
    },
  ],
  sponsors: [
    {
      event_id: "2026-11-28-SLP",
      sponsor: "Zillow",
      estado_comercial: "confirmed",
      etapa: "Cerrada",
      perk: "Vacantes",
      logo: "sí",
    },
  ],
  equipo: [
    {
      event_id: "2026-11-28-SLP",
      rol: "mc",
      persona: "Milo",
      confirmado: "sí",
    },
    {
      event_id: "2026-11-28-SLP",
      rol: "oos",
      persona: "Lalo",
      confirmado: "sí",
    },
  ],
});

function open(html: string, hoy = "2026-10-24") {
  const errors: string[] = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errors.push(String(e.message)));
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    virtualConsole: vc,
    beforeParse(w) {
      (w as unknown as { __HOY__: string }).__HOY__ = hoy;
    },
  });
  const d = dom.window.document;
  return {
    dom,
    d,
    errors,
    rows: () =>
      [...d.querySelectorAll("#tabla-tareas tbody tr")].map(
        (r) => r.children[0]?.textContent,
      ),
  };
}

describe("placeholder mode", () => {
  it("carries no event data when publish is off", () => {
    const html = renderSite(fixture(), {
      generado: "2026-10-24",
      publish: false,
    });
    expect(html).toContain("Sitio en preparación");
    for (const secret of ["San Luis", "Zillow", "Milo", "datos-json", "T001"])
      expect(html).not.toContain(secret);
  });
});

describe("published page: safety", () => {
  it("drops free-text notes and internal fields", () => {
    const d = fixture();
    d.tareas[0] = task("T001", "2026-10-03", "ops_central", "hecha", {
      nota: "SENTINEL_NOTE los sponsors aún no pagan",
    });
    const html = renderSite(d, { generado: "2026-10-24", publish: true });
    expect(html).not.toContain("SENTINEL_NOTE");
    expect(html).not.toContain("moneda_local");
    expect(html).not.toContain('"logo"');
  });
  it("refuses to build when an email, phone or amount slips in", () => {
    const withPerk = (perk: string): DashboardData => ({
      ...fixture(),
      sponsors: [
        {
          event_id: "e",
          sponsor: "X",
          estado_comercial: "c",
          etapa: "e",
          perk,
          logo: "sí",
        },
      ],
    });
    expect(() =>
      renderSite(withPerk("escribe a ana" + "@empresa.com"), {
        generado: "x",
        publish: true,
      }),
    ).toThrow(/correo/);
    expect(() =>
      renderSite(withPerk("llama al 55 1234 " + "5678"), {
        generado: "x",
        publish: true,
      }),
    ).toThrow(/teléfono/);
    expect(() =>
      renderSite(withPerk("aportó $5,000 MXN"), {
        generado: "x",
        publish: true,
      }),
    ).toThrow(/monto/);
  });
  it("allows the public ticket price and does not mistake dates for phones", () => {
    expect(findLeaks(sanitize(fixture()))).toEqual([]);
  });
  it("cannot be broken out of by a closing script tag in the data", () => {
    const d = fixture();
    d.tareas[0] = task("T001", "2026-10-03", "ops_central", "hecha", {
      tarea: "</script><img id=pwned src=x>",
    });
    const html = renderSite(d, { generado: "2026-10-24", publish: true });
    const { d: doc, errors } = open(html);
    expect(doc.getElementById("pwned")).toBeNull();
    expect(errors).toEqual([]);
  });
});

describe("published page: behaviour", () => {
  const html = renderSite(fixture(), { generado: "2026-10-24", publish: true });

  it("shows days left, overdue and the traffic lights", () => {
    const { d, errors } = open(html);
    expect(errors).toEqual([]);
    expect(d.getElementById("takeaway")?.textContent).toBe(
      "Faltan 35 días para San Luis Potosí. 1 tarea vencida, 1 con fecha en los próximos 7 días y 1 hechas de 6.",
    );
    const tiles = [...d.querySelectorAll(".tile")].map(
      (t) => `${t.children[1]?.textContent}=${t.children[0]?.textContent}`,
    );
    expect(tiles).toContain("días para el evento=35");
    expect(tiles).toContain("vencidas=1");
    expect(tiles).toContain("vencen hoy=1");
    expect(tiles).toContain("meta de asistentes=45");
    const chips = [...d.querySelectorAll("#semaforos .chip")].map(
      (c) => c.textContent,
    );
    expect(chips[0]).toBe("Tareas vencidas 1");
    expect(d.querySelector("#semaforos .chip .dot")?.className).toContain(
      "warn",
    );
    expect(chips[1]).toContain("MC y OOS asignados");
  });
  it("default view lists overdue and next 7 days, oldest first, without done tasks", () => {
    expect(open(html).rows()).toEqual(["T002", "T003", "T004"]);
  });
  it("filters by role", () => {
    const { d, rows } = open(html);
    const mc = [...d.querySelectorAll("#roles button")].find((b) =>
      b.textContent?.startsWith("mc"),
    ) as HTMLElement;
    mc.click();
    expect(rows()).toEqual(["T003"]);
    expect(
      d.querySelector('#roles button[aria-pressed="true"]')?.textContent,
    ).toContain("mc");
  });
  it("switches views", () => {
    const { d, rows } = open(html);
    const sel = d.getElementById("sel-vista") as HTMLSelectElement;
    sel.value = "hechas";
    sel.dispatchEvent(new d.defaultView!.Event("change"));
    expect(rows()).toEqual(["T001"]);
    sel.value = "abiertas";
    sel.dispatchEvent(new d.defaultView!.Event("change"));
    expect(rows()).toEqual(["T002", "T003", "T004", "T005", "T006"]);
    sel.value = "mes";
    sel.dispatchEvent(new d.defaultView!.Event("change"));
    expect(rows()).toEqual(["T002", "T003", "T004"]);
  });
  it("uses the viewer's date, so it stays right between deploys", () => {
    expect(
      open(html, "2026-11-28").d.getElementById("takeaway")?.textContent,
    ).toContain("Hoy es el evento en San Luis Potosí.");
    expect(
      open(html, "2026-12-03").d.getElementById("takeaway")?.textContent,
    ).toContain("fue hace 5 días");
    expect(open(html, "2026-11-20").rows()).not.toContain("T001");
  });
  it("renders stages, sponsors, team and facts", () => {
    const { d } = open(html);
    expect(
      [...d.querySelectorAll("#etapas .stage")].map((s) => s.textContent),
    ).toEqual(["00 · Alta1 archivo", "06 · Cierresin archivos"]);
    expect(d.querySelector("#tabla-sponsors tbody")?.textContent).toContain(
      "Zillow",
    );
    expect(d.querySelector("#tabla-equipo tbody")?.textContent).toContain(
      "Milo",
    );
    expect(d.getElementById("datos")?.textContent).toContain("$500 MXN");
  });
});

describe("the real repo", () => {
  it("builds and renders with no script errors", () => {
    const html = renderSite(buildDashboardData(REAL, "2026-10-24"), {
      generado: "2026-10-24",
      publish: true,
    });
    const { d, errors, dom } = open(html);
    expect(errors).toEqual([]);
    expect(
      (dom.window as unknown as { __RENDERED__?: boolean }).__RENDERED__,
    ).toBe(true);
    expect(
      d.querySelectorAll("#tabla-sponsors tbody tr").length,
    ).toBeGreaterThanOrEqual(4);
    expect(d.getElementById("takeaway")?.textContent).toMatch(
      /^Faltan 35 días para San Luis Potosí\./,
    );
  });
});
