# 06_cierre · asistencia, NPS, gastos, P&L y aprendizajes

One job: cerrar el evento con sus números reales y lo aprendido.

## Inputs

- Working (este evento): ../EVENTO.md
- Working (este evento): ../01_presupuesto/private/presupuesto.md (cifras; no se versiona)
- Working (este evento): ../03_sponsors/output/sponsors.md
- Working (este evento): private/ (gastos reales, facturas, export final; no se versiona)
- Reference (siempre): ../../../_playbook/pilares/participantes/playbook.md
- Reference (siempre): ../../../_playbook/pilares/finanzas/playbook.md
- Reference (siempre): ../../../_playbook/pilares/nucleo/playbook.md

Do NOT load: otros eventos.

## Process

1. **NPS primero**, porque pierde respuestas rápido. Anota solo agregados.
2. Con el export final (fuera de git): check-in, regresan y tallas en `participantes.md`. Nunca datos personales.
3. Gastos reales en `private/`; en `pnl.md` el P&L del evento (ingreso, costos, contribución, margen, costo por asistente) y la comparación contra el presupuesto.
4. Estado de cobro de cada sponsor (T099) y retro (T093).
5. Aprendizajes en `aprendizajes.md`: pilar, aprendizaje, fuente.
6. El evento solo pasa a `done` cuando todas las tareas `post` están hechas o no aplican; la última es T100.

## Outputs

- participantes.md → output/
- pnl.md → output/
- aprendizajes.md → output/

## Human check

Verifica que los gastos reales estén completos (sin ellos no se cierra), que las cuentas del P&L cuadren y que ningún dato personal haya entrado. Tú marcas `done` en `EVENTO.md`.
