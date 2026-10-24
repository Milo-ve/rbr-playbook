---
type: evento
id: "{{id}}"
ciudad: "{{ciudad}}"
codigo: "{{codigo}}"
fecha: "{{fecha}}"
estado: tentative
ciudad_nueva: "{{ciudad_nueva}}"
modelo: "{{modelo}}"
moneda_local: "{{moneda_local}}"
meta_asistentes:
meta_sponsors_usd:
---

# {{ciudad}} · {{fecha}}

Ficha del evento. Es la única verdad de fecha, estado y metas; ningún otro archivo las repite.

| Campo              | Valor                                                  |
| ------------------ | ------------------------------------------------------ |
| Estado             | `tentative` · `confirmed` · `done` · `cancelled`       |
| Meta de asistentes | (vacío = por definir)                                  |
| Meta de sponsors   | (vacío = sin meta, típico en community-led)            |
| Venue              | Ver `04_operaciones/output/proveedores.md`             |
| Giro de la edición | Lo que la hace distinta. Se define en `02_adquisicion` |

## Notas

Cada nota con fecha y quién decidió. Se agregan, no se sobrescriben.
