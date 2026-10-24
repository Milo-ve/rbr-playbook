---
type: router
---

# _playbook: la fábrica

Cómo se hace cada pilar. Estable y sin datos de ninguna ciudad en particular. Los eventos leen de aquí; aquí nunca se escribe por evento.

## Qué leer según lo que necesito

| Necesito…                                           | Leo                                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| Ciclo de vida, plantillas, convenciones             | [pilares/nucleo/playbook.md](pilares/nucleo/playbook.md)               |
| Arte, textos, distribución, registro                | [pilares/adquisicion/playbook.md](pilares/adquisicion/playbook.md)     |
| Sponsors, perks, facturación y cobro                | [pilares/sponsors/playbook.md](pilares/sponsors/playbook.md)           |
| Venue, comida, snacks, swag, staff, día del evento  | [pilares/operaciones/playbook.md](pilares/operaciones/playbook.md)     |
| Presupuesto, break even, gastos, P&L                | [pilares/finanzas/playbook.md](pilares/finanzas/playbook.md)           |
| Asistencia, retención, tallas, NPS                  | [pilares/participantes/playbook.md](pilares/participantes/playbook.md) |
| Reglas, privacidad, roles, voz, semáforos, glosario | `shared/`                                                              |
| Qué cambia si el evento es community-led            | [variantes/community-led.md](variantes/community-led.md)               |

## Formato de `tareas.md`

Cada pilar tiene un `tareas.md` con una tabla. Es la **única fuente** de las tareas y la lee el script de alta.

| Columna     | Valores                                                            |
| ----------- | ------------------------------------------------------------------ |
| `ID`        | `T###`                                                             |
| `Tarea`     | Texto                                                              |
| `Días`      | Entero relativo al evento (negativo = antes); `—` = sin fecha fija |
| `Rol`       | Ver [roles](shared/roles.md)                                       |
| `Fase`      | `pre` · `dia` · `post`                                             |
| `Condición` | Vacío = siempre · `ciudad-nueva` · `ciudad:<CÓDIGO>`               |

La tabla puede reformatearse (alinear columnas); el orden de columnas no cambia.
