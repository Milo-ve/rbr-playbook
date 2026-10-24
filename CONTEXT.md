---
type: router
---

# Cómo funciona el sistema

Un evento RBR se prepara en seis pilares que avanzan en paralelo y se cierran con números reales. Este archivo dice cómo se conectan; los detalles viven en cada pilar.

## Las tres capas

| Capa   | Dónde                               | Cambia                                                |
| ------ | ----------------------------------- | ----------------------------------------------------- |
| Método | `_playbook/` y `_templates/evento/` | Rara vez; solo cuando algo se aprende en tres eventos |
| Evento | `eventos/<id>/`                     | Todos los días                                        |
| Índice | `_index/eventos.md`                 | Se genera; no se edita                                |

## Ciclo de vida de un evento

Fechas relativas al día del evento (T). Las tareas exactas están en `eventos/<id>/tareas-del-evento.md`.

| Cuándo      | Etapa que arranca               | Entra / sale                                          |
| ----------- | ------------------------------- | ----------------------------------------------------- |
| T−56 a T−42 | `00_alta`, `01_presupuesto`     | Ficha, roles, break even. Presupuesto antes que venue |
| T−42 a T−35 | `04_operaciones`, `03_sponsors` | Venue, MC/OOS, comida; specs de sponsors              |
| T−35 a T−21 | `02_adquisicion`                | Textos, artes, campañas, registro                     |
| T−21 a T−1  | todas                           | Facturas, swag, lista de asistentes, compras          |
| T           | `05_dia-del-evento`             | Guion del día                                         |
| T+1 a T+14  | `06_cierre`                     | NPS, gastos reales, P&L, cobro, retro, cerrar         |

## Cómo se pasan el trabajo

- Lo que una etapa produce queda en su `output/` como archivo editable. La siguiente lee lo que la persona dejó.
- Un sponsor confirmado con su perk (`03_sponsors`) alimenta los textos (`02_adquisicion`), el swag y el guion del MC.
- El break even (`01_presupuesto`) dice cuánto se necesita de sponsors; el cierre lo compara con lo real.
- Los montos, facturas y exports van en `private/` de cada evento y no se versionan.

## Dónde buscar

| Pregunta                         | Archivo                                                |
| -------------------------------- | ------------------------------------------------------ |
| ¿Cómo se hace el pilar X?        | `_playbook/pilares/<pilar>/playbook.md`                |
| ¿Qué tareas tiene el pilar X?    | `_playbook/pilares/<pilar>/tareas.md` (única fuente)   |
| ¿Qué cambia si es community-led? | `_playbook/variantes/community-led.md`                 |
| ¿Qué estado tiene un evento?     | `_index/eventos.md` y los `output/` de ese evento      |
| ¿Qué pasa si cambia la fecha?    | `_playbook/pilares/nucleo/playbook.md` (ciclo de vida) |

## Scripts

`npm run stamp` crea un evento nuevo · `npm run index` reconstruye el índice · `npm run check` valida la estructura.
