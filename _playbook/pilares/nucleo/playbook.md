---
type: playbook
pilar: nucleo
fuente: PM docs 01-nucleo-y-tareas (2026-10-24)
---

# Núcleo: eventos, personas y ciclo de vida

La base que usan los demás pilares: qué evento es, quién trabaja en él y qué tiene que pasar para que salga. En un evento corresponde a `00_alta`.

## Un evento

Se identifica con `AAAA-MM-DD-CIUDAD` (ej. `2026-11-28-SLP`). Sin fecha: `TBD-CIUDAD`, que no genera tareas ni presupuesto. El `event_id` lleva la fecha: **cambiar la fecha es renombrar la carpeta** y recalcular las tareas abiertas.

| Dato               | Qué es                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| Estado             | `tentative` · `confirmed` · `done` · `cancelled`                                |
| Ciudad nueva       | Primera edición en la ciudad: activa las tareas marcadas `ciudad-nueva`         |
| Modelo             | `estandar` o `community-led` (ver [variante](../../variantes/community-led.md)) |
| Meta de asistentes | Número                                                                          |
| Meta de sponsors   | USD; vacío = sin meta (típico en community-led)                                 |
| Moneda local       | USD, MXN, COP, CLP, ARS, PEN, BRL                                               |

Códigos de ciudad usados: CDMX, GDL, MTY, QRO, SLP, SF, BOG, MDE, SCL, BUE, LIM, SAO.

**Qué no va en la ficha del evento:** asistentes, tickets, estado de venue, catering o swag. Eso se deriva del registro, la asistencia y las tareas.

## Personas y roles

Ver [roles](../../shared/roles.md). Por defecto: `ops_central` y `partnerships` en todo evento nuevo; MC y OOS se piden al equipo central. Solo staff y equipo, **nunca participantes**.

## Ciclo de vida

1. **Alta** (`00_alta`): ficha del evento, roles; quien lidera da meta de asistentes, meta de sponsors, si es ciudad nueva, MC y OOS.
2. **Tareas:** se generan desde las plantillas por pilar. Si el evento es del mismo día o pasado, solo las `post`, porque las `pre` saldrían vencidas.
3. **Presupuesto preliminar** si ya hay fecha (ver [finanzas](../finanzas/playbook.md)).
4. **Pre-evento:** avanzan las tareas de cada pilar. Si cambia la fecha, se renombra la carpeta y se recalculan las fechas de las tareas abiertas; las manuales se revisan a mano. `por confirmar`: todavía no hay script que lo haga (pendiente).
5. **Día del evento:** tareas `dia` y [run of show](../operaciones/piezas/run-of-show.md).
6. **Cierre:** el evento sigue abierto hasta que todas sus tareas `post` estén hechas o no aplican; la última es T100. Pasos: export final, gastos reales, estado de cobro de cada deal, NPS, aprendizajes, P&L y estado → `done`.

## Plantillas de tareas

94 plantillas activas repartidas por pilar y fase. Cada pilar tiene su tabla en `pilares/<pilar>/tareas.md`: es la **fuente única**. Solo se editan cuando quien lidera lo pide; si se detecta una tarea recurrente que falta o sobra, se propone.

### Solo en ciudad nueva

T013 participantes por contactos directos · T029 buscar venues · T030 validar specs del venue · T051 invitar al equipo de embajadores locales.

### Desactivadas y por qué

| ID   | Tarea                        | Motivo                                                      |
| ---- | ---------------------------- | ----------------------------------------------------------- |
| T064 | Participante se registra     | Lo hace el sistema                                          |
| T085 | Encuesta de NPS              | Fusionada en T084                                           |
| T092 | Actualizar directorios       | No es necesaria                                             |
| T094 | Documentar aprendizajes      | No es necesaria (los aprendizajes se capturan en el cierre) |
| T095 | Archivar copia del dashboard | Inactiva desde la migración                                 |
| T096 | Slack a general con resumen  | No es necesaria                                             |
| T101 | Post general post-evento     | Fusionada en T086                                           |

### Decisiones sobre el calendario

- **Presupuesto primero:** T001 confirmar fecha a −56, T097 presupuesto a −49, T057 capacidad y presupuesto a −42. Van antes que venue y capacidad.
- Plantillas con rango ("4-5 semanas antes") usan el extremo temprano.
- T052 es solo MC y OOS; los voluntarios van en T053.
- T033: el anticipo del venue se paga solo si el venue lo pide.

## Convenciones

- Fechas ISO `AAAA-MM-DD`. Montos en moneda local con su moneda.
- `por revisar` / `por confirmar` = dato dudoso: no se usa como verdad sin mencionarlo.
- Si algo contradice un dato existente, se muestran ambos y se pregunta antes de sobrescribir.
- Las notas se agregan, no se sobrescriben: cada cambio va con fuente y fecha.
- Una tarea `bloqueada` exige decir qué la bloquea.

## Aprendizajes

Se capturan en el cierre y en la retro (T093), con evento, pilar, aprendizaje y fuente, en `06_cierre/output/aprendizajes.md`. Los de ediciones anteriores se incorporan al playbook de su pilar cuando se repiten en tres eventos.
