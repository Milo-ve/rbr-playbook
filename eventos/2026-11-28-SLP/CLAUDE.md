# 2026-11-28-SLP

Evento de Release Before Ready en San Luis Potosí. Fecha: 2026-11-28. Ficha y metas: [EVENTO.md](EVENTO.md). Tareas con fechas: [tareas-del-evento.md](tareas-del-evento.md).

Las reglas viven en [`_playbook/shared/reglas-duras.md`](../../_playbook/shared/reglas-duras.md). Aquí solo se trabaja el evento.

## Etapas

Se trabajan en paralelo; el número marca cuándo arranca cada una.

| Etapa               | Qué hace                                          | Salida                                          |
| ------------------- | ------------------------------------------------- | ----------------------------------------------- |
| `00_alta`           | Completar la ficha y asignar roles                | `roles.md`                                      |
| `01_presupuesto`    | Presupuesto y break even                          | `estado.md` (cifras en `private/`)              |
| `02_adquisicion`    | Textos, artes, distribución, registro             | `materiales.md`, `registro.md`                  |
| `03_sponsors`       | Sponsors, perks, factura y cobro                  | `sponsors.md`                                   |
| `04_operaciones`    | Venue, comida, snacks, swag, staff                | `proveedores.md`, `compras.md`                  |
| `05_dia-del-evento` | Guion del día y checklist                         | `run-of-show.md`                                |
| `06_cierre`         | Asistencia, NPS, gastos reales, P&L, aprendizajes | `participantes.md`, `pnl.md`, `aprendizajes.md` |

## Cómo trabajo aquí

1. Abro la `CONTEXT.md` de la etapa. Ahí están sus entradas exactas.
2. Leo solo lo que esa lista dice.
3. Escribo el resultado en `output/` de la etapa y lo dejo para que una persona lo revise.
4. Lo que dice `private/` no se versiona: montos, facturas, exports.

## Estado

Una etapa tiene avance si su `output/` tiene archivos. No hay archivo de estado a mano.
