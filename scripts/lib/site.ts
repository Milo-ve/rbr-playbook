import { hasMoneyAmount } from './check';
import type { DashboardData, Row } from './dashboard-data';

export interface SiteOptions {
  /** Build date (ISO). Shown as "datos al"; overdue and days-left use the viewer's own date. */
  generado: string;
  /** Without publish the page carries no event data at all. */
  publish: boolean;
}

export interface SiteData {
  eventos: Row[];
  tareas: Row[];
  etapas: Row[];
  sponsors: Row[];
  equipo: Row[];
}

const pick = (r: Row, keys: string[]): Row => Object.fromEntries(keys.map((k) => [k, r[k] ?? null]));

/**
 * Keeps only the fields the page shows. Free-text notes (task notes, event notes) are dropped on
 * purpose: they are the one place where something sensitive can be typed by hand.
 */
export function sanitize(d: DashboardData): SiteData {
  return {
    eventos: d.eventos.map((r) =>
      pick(r, ['event_id', 'ciudad', 'fecha', 'estado', 'modelo', 'ciudad_nueva', 'meta_asistentes', 'precio', 'venue', 'horario']),
    ),
    tareas: d.tareas.map((r) => pick(r, ['event_id', 'id', 'tarea', 'fecha', 'rol', 'pilar', 'estado'])),
    etapas: d.etapas.map((r) => pick(r, ['event_id', 'etapa', 'nombre', 'archivos', 'con_salida'])),
    sponsors: d.sponsors.map((r) => pick(r, ['event_id', 'sponsor', 'estado_comercial', 'etapa', 'perk'])),
    equipo: d.equipo.map((r) => pick(r, ['event_id', 'rol', 'persona', 'confirmado'])),
  };
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE = /(\+?\d[\s().-]?){10,}/;

/**
 * Things that must never reach a page: emails, phone numbers, money amounts.
 * The public ticket price is the one allowed amount, so the `precio` field is skipped.
 */
export function findLeaks(data: SiteData): string[] {
  const leaks: string[] = [];
  for (const [table, rows] of Object.entries(data)) {
    for (const row of rows as Row[]) {
      for (const [key, value] of Object.entries(row)) {
        if (key === 'precio' || typeof value !== 'string') continue;
        const text = value.replace(/\d{4}-\d{2}-\d{2}/g, '');
        if (EMAIL.test(text)) leaks.push(`${table}.${key}: parece un correo`);
        if (PHONE.test(text)) leaks.push(`${table}.${key}: parece un teléfono`);
        if (hasMoneyAmount(text)) leaks.push(`${table}.${key}: parece un monto`);
      }
    }
  }
  return leaks;
}

/** JSON that is safe inside a <script> element. */
const LINE_SEP = new RegExp(String.fromCharCode(0x2028), "g");
const PARA_SEP = new RegExp(String.fromCharCode(0x2029), "g");
const embed = (v: unknown) =>
  JSON.stringify(v).replace(/</g, "\\u003c").replace(LINE_SEP, "\\u2028").replace(PARA_SEP, "\\u2029");

const HEAD = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<title>Tablero RBR</title>`;

const CSS = String.raw`
:root { --bg:#f5f6f8; --panel:#ffffff; --fg:#14181f; --muted:#596273; --line:#d9dee6; --grid:#e8ebf0; --ok:#17794a; --warn:#9a5b00; --bad:#bf3329; --s1:#2f5bea; --s2:#93abf5; --s3:#d3d9e2; --radius:8px; }
@media (prefers-color-scheme: dark) { :root { --bg:#0e1117; --panel:#161b24; --fg:#e7eaf0; --muted:#98a2b3; --line:#293040; --grid:#212836; --ok:#4cc38a; --warn:#e0a030; --bad:#f0746b; --s1:#7b9cff; --s2:#4a5fa6; --s3:#2c3444; } }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
.wrap { max-width:72rem; margin:0 auto; padding:1.25rem max(1rem, env(safe-area-inset-right)) 3rem max(1rem, env(safe-area-inset-left)); display:flex; flex-direction:column; gap:1.5rem; }
h1 { font:400 1.9rem/1.2 ui-serif,Georgia,serif; margin:0; text-wrap:balance; }
h2 { font-size:1.05rem; font-weight:600; margin:0 0 .25rem; }
p { margin:0; }
.muted { color:var(--muted); font-size:.85rem; }
.headrow { display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:.75rem; }
.takeaway { font-size:1.1rem; line-height:1.5; max-width:52rem; margin-top:.5rem; }
b { font-variant-numeric:tabular-nums; font-weight:600; }
select, button { font:inherit; color:var(--fg); background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:.35rem .7rem; }
button { cursor:pointer; }
:focus-visible { outline:2px solid var(--fg); outline-offset:2px; }
.card { background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:1.1rem 1.25rem; min-width:0; }
.tiles { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,9.5rem),1fr)); gap:.75rem; }
.tile { background:var(--panel); border:1px solid var(--line); border-radius:var(--radius); padding:.8rem 1rem; display:flex; flex-direction:column; gap:.2rem; min-width:0; }
.tile b { font:400 2rem/1.1 ui-serif,Georgia,serif; }
.tile.alert b { color:var(--bad); }
.chips { display:flex; flex-wrap:wrap; gap:.5rem; }
.chip { display:inline-flex; align-items:center; gap:.4rem; background:var(--panel); border:1px solid var(--line); border-radius:999px; padding:.2rem .75rem; font-size:.85rem; }
.dot { width:.5rem; height:.5rem; border-radius:50%; background:var(--s3); flex:none; }
.dot.ok { background:var(--ok); } .dot.warn { background:var(--warn); } .dot.bad { background:var(--bad); }
.filters { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; margin:.75rem 0 1rem; }
.filters button[aria-pressed="true"] { background:var(--fg); color:var(--bg); border-color:var(--fg); }
.filters button b { margin-left:.35rem; }
.scroll { overflow-x:auto; }
table { width:100%; border-collapse:collapse; }
th { text-align:left; font-weight:600; color:var(--muted); font-size:.8rem; padding:.3rem .6rem; border-bottom:1px solid var(--line); white-space:nowrap; }
td { padding:.5rem .6rem; border-bottom:1px solid var(--grid); vertical-align:top; font-variant-numeric:tabular-nums; }
td.nowrap { white-space:nowrap; }
tr.late td:nth-child(2) { color:var(--bad); font-weight:600; }
.est { display:inline-block; border-radius:999px; padding:0 .55rem; font-size:.8rem; border:1px solid var(--line); white-space:nowrap; }
.est.hecha { border-color:transparent; background:var(--grid); color:var(--muted); }
.est.en-curso { border-color:var(--fg); }
.bars { display:flex; flex-direction:column; gap:.6rem; margin-top:.75rem; }
.barrow { display:grid; grid-template-columns:minmax(6rem,9rem) 1fr auto; gap:.6rem; align-items:center; }
.track { display:flex; height:.75rem; border-radius:4px; overflow:hidden; background:var(--grid); }
.track span { display:block; height:100%; }
.legend { display:flex; flex-wrap:wrap; gap:1rem; margin-top:.75rem; }
.legend i { display:inline-block; width:.65rem; height:.65rem; border-radius:2px; margin-right:.35rem; vertical-align:middle; }
.stages { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,9rem),1fr)); gap:.5rem; margin-top:.75rem; }
.stage { border:1px solid var(--line); border-radius:var(--radius); padding:.5rem .8rem; display:flex; flex-direction:column; gap:2px; min-width:0; }
.stage.on { border-color:var(--fg); }
.stage .n { font-size:.8rem; color:var(--muted); }
.facts { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr)); gap:.8rem 1.25rem; margin:.75rem 0 0; }
.facts dt { color:var(--muted); font-size:.8rem; }
.facts dd { margin:0; overflow-wrap:anywhere; }
.grid2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr)); gap:.75rem; }
.empty { color:var(--muted); padding:.75rem 0; }
footer { border-top:1px solid var(--line); padding-top:.75rem; }
@media (prefers-reduced-motion: no-preference) { .track span { transition:width .3s ease-out; } }
`;

const BODY = `
<div class="wrap" id="rbr">
  <header>
    <div class="headrow">
      <h1 id="titulo">Tablero RBR</h1>
      <label class="muted" id="evento-label" hidden>Evento <select id="sel-evento" aria-label="Evento"></select></label>
    </div>
    <p class="takeaway" id="takeaway"></p>
  </header>
  <section aria-labelledby="h-hoy">
    <h2 id="h-hoy">Dónde estamos</h2>
    <div class="tiles" id="tiles"></div>
    <div class="chips" id="semaforos" style="margin-top:.75rem"></div>
    <p class="muted" style="margin-top:.5rem">Tareas vencidas: 0 verde, 1 a 3 amarillo, 4 o más rojo. Tickets y sponsors se miden cuando hay export de registro y meta de sponsors.</p>
  </section>
  <section class="card" aria-labelledby="h-semana">
    <h2 id="h-semana">Qué toca</h2>
    <p class="muted">Elige un rol para ver solo sus tareas. Las vencidas salen primero.</p>
    <div class="filters">
      <div class="chips" id="roles" role="group" aria-label="Rol"></div>
      <select id="sel-vista" aria-label="Vista de tareas">
        <option value="semana">Vencidas y próximos 7 días</option>
        <option value="mes">Vencidas y próximos 30 días</option>
        <option value="abiertas">Todas las abiertas</option>
        <option value="hechas">Hechas</option>
      </select>
    </div>
    <div class="scroll">
      <table id="tabla-tareas"><thead><tr><th>ID</th><th>Fecha</th><th>Tarea</th><th>Rol</th><th>Estado</th></tr></thead><tbody></tbody></table>
    </div>
    <p class="empty" id="tareas-vacio" hidden>No hay tareas en esta vista.</p>
    <p class="muted" id="tareas-nota"></p>
  </section>
  <div class="grid2">
    <section class="card" aria-labelledby="h-pilares"><h2 id="h-pilares">Avance por pilar</h2><p class="muted">Tareas hechas, en curso y pendientes de cada pilar.</p><div class="bars" id="pilares"></div><div class="legend muted" id="leyenda"></div></section>
    <section class="card" aria-labelledby="h-etapas"><h2 id="h-etapas">Etapas del evento</h2><p class="muted">Una etapa tiene avance cuando ya produjo archivos.</p><div class="stages" id="etapas"></div></section>
  </div>
  <section class="card" aria-labelledby="h-datos"><h2 id="h-datos">Datos del evento</h2><dl class="facts" id="datos"></dl></section>
  <div class="grid2">
    <section class="card" aria-labelledby="h-sponsors"><h2 id="h-sponsors">Sponsors y perks</h2><p class="muted">Sin montos: los montos no se publican aquí.</p><div class="scroll"><table id="tabla-sponsors"><thead><tr><th>Sponsor</th><th>Etapa</th><th>Perk</th></tr></thead><tbody></tbody></table></div></section>
    <section class="card" aria-labelledby="h-equipo"><h2 id="h-equipo">Equipo</h2><p class="muted">Quién lleva cada rol.</p><div class="scroll"><table id="tabla-equipo"><thead><tr><th>Rol</th><th>Persona</th><th>Confirmado</th></tr></thead><tbody></tbody></table></div></section>
  </div>
  <footer><p class="muted" id="pie"></p></footer>
</div>`;

/* Plain JS, no template literals, so it can live in a String.raw block without escaping. */
const CLIENT = String.raw`
(function () {
  var DATA = JSON.parse(document.getElementById('datos-json').textContent);
  var GENERADO = document.getElementById('generado').textContent;
  function $(s) { return document.querySelector(s); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function hoy() {
    if (window.__HOY__) return window.__HOY__;
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addDays(iso, n) { return new Date(Date.parse(iso) + n * 864e5).toISOString().slice(0, 10); }
  function diffDays(a, b) { return Math.round((Date.parse(a) - Date.parse(b)) / 864e5); }
  function plural(n, uno, varios) { return n === 1 ? uno : varios; }
  var state = { evento: null, rol: 'todos', vista: 'semana' };
  var PILARES = { adquisicion: 'Adquisición', sponsors: 'Sponsors', operaciones: 'Operaciones', participantes: 'Participantes', finanzas: 'Finanzas', nucleo: 'Núcleo' };
  var ETAPAS = { alta: 'Alta', presupuesto: 'Presupuesto', adquisicion: 'Adquisición', sponsors: 'Sponsors', operaciones: 'Operaciones', 'dia-del-evento': 'Día del evento', cierre: 'Cierre' };
  function forEvent(rows) { return rows.filter(function (r) { return r.event_id === state.evento; }); }
  function abierta(t) { return t.estado === 'pendiente' || t.estado === 'en-curso'; }

  function resumen(ev) {
    var h = hoy(), lim = addDays(h, 7);
    var t = forEvent(DATA.tareas), ab = t.filter(abierta);
    var n = function (s) { return t.filter(function (x) { return x.estado === s; }).length; };
    var eq = forEvent(DATA.equipo).filter(function (x) { return x.confirmado === 'sí'; });
    var tiene = function (r) { return eq.some(function (x) { return x.rol === r || x.rol === 'mc+oos'; }); };
    return {
      hoy: h, dias: diffDays(ev.fecha, h), total: t.length, hechas: n('hecha'), en_curso: n('en-curso'), pendientes: n('pendiente'),
      vencidas: ab.filter(function (x) { return x.fecha && x.fecha < h; }).length,
      vencen_hoy: ab.filter(function (x) { return x.fecha === h; }).length,
      proximos7: ab.filter(function (x) { return x.fecha > h && x.fecha <= lim; }).length,
      sin_fecha: ab.filter(function (x) { return !x.fecha; }).length,
      staff: tiene('mc') && tiene('oos')
    };
  }
  function semaforo(n) { return n === 0 ? 'ok' : n <= 3 ? 'warn' : 'bad'; }
  function chip(cls, label, value) {
    var c = el('span', 'chip'); c.append(el('span', 'dot ' + cls), document.createTextNode(label + (value === undefined ? '' : ' '))); if (value !== undefined) c.append(el('b', '', String(value))); return c;
  }

  function drawHeader(res, ev) {
    var t = $('#takeaway'); t.replaceChildren();
    var cuando;
    if (res.dias > 0) cuando = ['Faltan ', res.dias, plural(res.dias, ' día', ' días') + ' para ' + ev.ciudad + '. '];
    else if (res.dias === 0) cuando = ['', '', 'Hoy es el evento en ' + ev.ciudad + '. '];
    else cuando = ['El evento en ' + ev.ciudad + ' fue hace ', -res.dias, plural(-res.dias, ' día. ', ' días. ')];
    t.append(document.createTextNode(cuando[0]));
    if (cuando[1] !== '') t.append(el('b', '', String(cuando[1])));
    t.append(document.createTextNode(cuando[2]));
    t.append(el('b', '', String(res.vencidas)), document.createTextNode(plural(res.vencidas, ' tarea vencida, ', ' tareas vencidas, ')));
    t.append(el('b', '', String(res.proximos7)), document.createTextNode(' con fecha en los próximos 7 días y '));
    t.append(el('b', '', String(res.hechas)), document.createTextNode(' hechas de '), el('b', '', String(res.total)), document.createTextNode('.'));
  }
  function drawTiles(res, ev) {
    var box = $('#tiles'); box.replaceChildren();
    var tile = function (label, value, alert) { var d = el('div', 'tile' + (alert ? ' alert' : '')); d.append(el('b', '', String(value)), el('span', 'muted', label)); return d; };
    box.append(
      tile('días para el evento', res.dias), tile('tareas hechas', res.hechas), tile('en curso', res.en_curso),
      tile('vencidas', res.vencidas, res.vencidas > 0), tile('vencen hoy', res.vencen_hoy),
      tile('meta de asistentes', ev.meta_asistentes === null ? '—' : ev.meta_asistentes)
    );
    $('#semaforos').replaceChildren(
      chip(semaforo(res.vencidas), 'Tareas vencidas', res.vencidas),
      chip(res.staff ? 'ok' : 'bad', 'Staff: ' + (res.staff ? 'MC y OOS asignados' : 'falta MC u OOS')),
      chip('', 'Tickets: sin export'), chip('', 'Sponsors: sin meta')
    );
  }
  function drawRoles(res) {
    var box = $('#roles'); box.replaceChildren();
    var roles = ['todos'];
    forEvent(DATA.tareas).forEach(function (t) { if (roles.indexOf(t.rol) < 0) roles.push(t.rol); });
    roles.forEach(function (r) {
      var b = el('button', '', r === 'todos' ? 'Todos' : r); b.type = 'button'; b.setAttribute('aria-pressed', String(state.rol === r));
      b.addEventListener('click', function () { state.rol = r; render(); });
      if (r !== 'todos') {
        var v = forEvent(DATA.tareas).filter(function (t) { return t.rol === r && abierta(t) && t.fecha && t.fecha < res.hoy; }).length;
        if (v > 0) { b.append(el('b', '', String(v))); b.title = v + ' vencidas'; }
      }
      box.append(b);
    });
  }
  function drawTasks(res) {
    var tbody = $('#tabla-tareas tbody'); tbody.replaceChildren();
    var list = forEvent(DATA.tareas);
    if (state.rol !== 'todos') list = list.filter(function (t) { return t.rol === state.rol; });
    if (state.vista === 'hechas') list = list.filter(function (t) { return t.estado === 'hecha'; });
    else {
      list = list.filter(abierta);
      if (state.vista === 'semana') list = list.filter(function (t) { return t.fecha && t.fecha <= addDays(res.hoy, 7); });
      if (state.vista === 'mes') list = list.filter(function (t) { return t.fecha && t.fecha <= addDays(res.hoy, 30); });
    }
    list.sort(function (a, b) { var x = a.fecha || '9999', y = b.fecha || '9999'; return x < y ? -1 : x > y ? 1 : a.id.localeCompare(b.id); });
    list.forEach(function (t) {
      var tr = document.createElement('tr');
      if (abierta(t) && t.fecha && t.fecha < res.hoy) tr.className = 'late';
      var last = el('td'); last.append(el('span', 'est ' + t.estado, t.estado));
      tr.append(el('td', 'nowrap', t.id), el('td', '', t.fecha || ''), el('td', '', t.tarea), el('td', 'nowrap', t.rol), last);
      tbody.append(tr);
    });
    $('#tareas-vacio').hidden = list.length > 0; $('#tabla-tareas').hidden = list.length === 0;
    var nota = $('#tareas-nota'); nota.replaceChildren();
    if (state.vista !== 'hechas' && state.vista !== 'abiertas' && res.sin_fecha > 0) {
      nota.textContent = res.sin_fecha + plural(res.sin_fecha, ' tarea abierta no tiene fecha fija y solo sale en "Todas las abiertas".', ' tareas abiertas no tienen fecha fija y solo salen en "Todas las abiertas".');
    }
  }
  function drawPillars() {
    var box = $('#pilares'); box.replaceChildren();
    var rows = forEvent(DATA.tareas), pilares = [];
    rows.forEach(function (t) { if (pilares.indexOf(t.pilar) < 0) pilares.push(t.pilar); });
    var colores = ['var(--s1)', 'var(--s2)', 'var(--s3)'];
    pilares.forEach(function (p) {
      var t = rows.filter(function (x) { return x.pilar === p; });
      var n = function (s) { return t.filter(function (x) { return x.estado === s; }).length; };
      var track = el('div', 'track');
      [n('hecha'), n('en-curso'), n('pendiente')].forEach(function (c, i) { var s = el('span'); s.style.width = (t.length ? 100 * c / t.length : 0) + '%'; s.style.background = colores[i]; track.append(s); });
      var row = el('div', 'barrow'); row.append(el('span', '', PILARES[p] || p), track, el('span', 'muted', n('hecha') + ' de ' + t.length)); box.append(row);
    });
    var lg = $('#leyenda'); lg.replaceChildren();
    [['Hechas', colores[0]], ['En curso', colores[1]], ['Pendientes', colores[2]]].forEach(function (x) { var s = el('span', '', x[0]); var i = el('i'); i.style.background = x[1]; s.prepend(i); lg.append(s); });
  }
  function drawStages() {
    var box = $('#etapas'); box.replaceChildren();
    forEvent(DATA.etapas).forEach(function (e) {
      var s = el('div', 'stage' + (e.con_salida === 'sí' ? ' on' : ''));
      s.append(el('span', '', e.etapa + ' · ' + (ETAPAS[e.nombre] || e.nombre)), el('span', 'n', e.con_salida === 'sí' ? e.archivos + (e.archivos === 1 ? ' archivo' : ' archivos') : 'sin archivos'));
      box.append(s);
    });
  }
  function drawFacts(ev) {
    var dl = $('#datos'); dl.replaceChildren();
    var fecha = new Date(ev.fecha + 'T00:00:00Z').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    [['Fecha', fecha], ['Estado', ev.estado], ['Modelo', ev.modelo], ['Ciudad nueva', ev.ciudad_nueva], ['Boleto', ev.precio], ['Venue', ev.venue], ['Horario', ev.horario]].forEach(function (x) {
      if (!x[1]) return; var d = el('div'); d.append(el('dt', '', x[0]), el('dd', '', String(x[1]))); dl.append(d);
    });
  }
  function fill(sel, rows, cols) {
    var tbody = $(sel + ' tbody'); tbody.replaceChildren();
    rows.forEach(function (r) { var tr = document.createElement('tr'); cols.forEach(function (c) { tr.append(el('td', '', String(r[c] == null ? '' : r[c]))); }); tbody.append(tr); });
  }
  function render() {
    var eventos = DATA.eventos;
    if (!eventos.length) { $('#takeaway').textContent = 'Todavía no hay eventos en el repositorio.'; return; }
    if (!eventos.some(function (e) { return e.event_id === state.evento; })) {
      var h = hoy();
      var futuros = eventos.filter(function (e) { return e.fecha >= h; }).sort(function (a, b) { return a.fecha.localeCompare(b.fecha); });
      state.evento = (futuros[0] || eventos[0]).event_id;
    }
    var sel = $('#sel-evento');
    sel.replaceChildren.apply(sel, eventos.map(function (e) { return new Option(e.ciudad + ' · ' + e.fecha, e.event_id); }));
    sel.value = state.evento; $('#evento-label').hidden = eventos.length < 2;
    var ev = eventos.filter(function (e) { return e.event_id === state.evento; })[0];
    var res = resumen(ev);
    $('#titulo').textContent = 'Tablero RBR · ' + ev.ciudad;
    drawHeader(res, ev); drawTiles(res, ev); drawRoles(res); drawTasks(res); drawPillars(); drawStages(); drawFacts(ev);
    fill('#tabla-sponsors', forEvent(DATA.sponsors), ['sponsor', 'etapa', 'perk']);
    fill('#tabla-equipo', forEvent(DATA.equipo), ['rol', 'persona', 'confirmado']);
    $('#pie').textContent = 'Fuente: los archivos del repositorio RBR Playbook. Datos al ' + GENERADO + '. Las fechas y los días que faltan se calculan con la fecha de hoy. No incluye montos ni datos personales de participantes.';
  }
  $('#sel-evento').addEventListener('change', function (e) { state.evento = e.target.value; state.rol = 'todos'; render(); });
  $('#sel-vista').addEventListener('change', function (e) { state.vista = e.target.value; render(); });
  render();
  window.__RENDERED__ = true;
})();
`;

const PLACEHOLDER = `<!doctype html>
<html lang="es"><head>${HEAD}<style>${CSS}</style></head>
<body><div class="wrap"><h1>Tablero RBR</h1><p class="muted">Sitio en preparación. Todavía no hay información publicada.</p></div></body></html>
`;

/** Builds the full page. With `publish: false` it returns a page with no event data at all. */
export function renderSite(data: DashboardData, opts: SiteOptions): string {
  if (!opts.publish) return PLACEHOLDER;
  const safe = sanitize(data);
  const leaks = findLeaks(safe);
  if (leaks.length) throw new Error(`No se publica: ${leaks.slice(0, 5).join('; ')}`);
  return `<!doctype html>
<html lang="es"><head>${HEAD}<style>${CSS}</style></head>
<body>${BODY}
<script type="application/json" id="datos-json">${embed(safe)}</script>
<script type="text/plain" id="generado">${opts.generado}</script>
<script>${CLIENT}</script>
</body></html>
`;
}

/** Headers for Cloudflare Pages: no indexing, no caching, no referrer. */
export const HEADERS = `/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
`;
