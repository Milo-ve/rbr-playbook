---
type: playbook
pilar: sponsors
fuente: PM docs 03-sponsors (2026-10-24)
---

# Sponsors: ingresos por patrocinio y su facturación

Qué empresas apoyan, con qué, en qué evento, en qué etapa va cada deal y si ya se cobró. Lo lleva Partnerships. En un evento corresponde a la etapa `03_sponsors`.

Tareas con fechas: [tareas.md](tareas.md).

## Dónde se guarda cada cosa

| Qué                                                            | Dónde en el evento               | ¿Git?             |
| -------------------------------------------------------------- | -------------------------------- | ----------------- |
| Sponsor, perk, etapa, checklist de onboarding                  | `03_sponsors/output/sponsors.md` | Sí                |
| **Montos** (presupuestado y cobrado), facturas, datos de cobro | `03_sponsors/private/`           | **No** (ignorado) |

Así quien opera el evento ve los montos de **su** evento, y los montos nunca viajan con el repo.

## Un deal

Sponsor × evento. Campos que importan:

| Campo            | Valores                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Estado comercial | `confirmed` · `pending` · `cancelled`                                                                     |
| Estado de cobro  | `pending` · `invoiced` · `paid` · `unknown`                                                               |
| Perk             | Beneficio para participantes (lo usan los materiales de adquisición)                                      |
| Onboarding       | Logo recibido · contacto en el grupo de WhatsApp · media kit enviado                                      |
| Monto            | Moneda del deal; **0 = en especie** (por ejemplo, el sponsor da el venue). No cuenta como cobro pendiente |

Un monto en 0 no es lo mismo que cancelado: un deal se cancela solo cuando se cae.

## Embudo de etapas

| Etapa               | Estado comercial | Estado de cobro          |
| ------------------- | ---------------- | ------------------------ |
| Oportunidad         | pending          | (cualquiera)             |
| Cerrada             | confirmed        | pending                  |
| Facturada           | confirmed        | invoiced                 |
| Cobrada             | confirmed        | paid (con monto cobrado) |
| Cobro por confirmar | confirmed        | unknown                  |
| Perdida             | cancelled        | —                        |

## Flujo por sponsor

1. **Registrar el deal cerrado** (T016): monto, expectativas, contacto, perks.
2. **Pedir specs** (T017): logo, perk, datos. A −35 días.
3. **Avisar a Ops Central** del logo para flyers y artes (T019) y del perk para el swag (T024).
4. **Factura y cobro** (T018) a −21 días. Pasa el deal a `invoiced` y luego `paid`.
5. **Onboarding** (T020-T022): iniciar, sumar a los correos del evento, sumar su contacto al grupo de WhatsApp.
6. **Lista de participantes** (T023): se agrega como cortesía en el admin.
7. **Media kit** (T025) y compartir el perk en WhatsApp (T026) y con el MC (T027).
8. **Día del evento:** el MC lo menciona (T028).
9. **Post-evento:** evidencias (T083), post en redes (T086), evidencias y media kit al sponsor (T087), correo de agradecimiento (T088) y **confirmar el cobro** (T099) a +14 días.

## Medir

- **Semáforo de sponsors** (confirmado vs meta, en USD): 🟢 ≥70% · 🟡 50-69% · 🔴 <50% · ⚪ sin meta. Solo cuentan los deals `confirmed`; los `pending` se muestran aparte. Ver [semaforos](../../shared/semaforos.md).
- **Sin cobro:** deals confirmados con monto mayor a 0 y cobro `pending`, `invoiced` o `unknown`.
- **Prioridad alta:** sponsors por debajo del 50% de la meta a 45 días o menos del evento; specs y facturación atrasadas; cobro pendiente de eventos pasados.
- **Break even:** cuánto se necesita de sponsors para no perder. Ver [finanzas](../finanzas/playbook.md).

## Reglas

- Los materiales de adquisición nombran sponsors confirmados y sus perks, **nunca montos**. Los `pending` no aparecen salvo confirmación.
- Deal en especie (venue, espacio): monto 0. Cuando un sponsor da dinero y además el venue, el deal lleva su monto y el venue va en 0 en el presupuesto. Que el sponsor sea en especie no quita que el venue tenga costo: se revisa evento por evento.
- Los eventos community-led pueden no tener meta de sponsors. Ver [variante community-led](../../variantes/community-led.md).
- Quien no es del equipo central ve los sponsors de su evento, no los de otros.

## Por confirmar

- Qué CRM se usa para T016 en ciudades nuevas (hoy era una hoja de seguimiento interna).
- Cómo se revisan los paquetes multi-evento (un sponsor que paga varios eventos con un solo monto): la estructura existe pero no se ha usado.
