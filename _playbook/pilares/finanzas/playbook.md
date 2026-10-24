---
type: playbook
pilar: finanzas
fuente: PM docs 06-finanzas (2026-10-24)
---

# Finanzas: cuánto cuesta y cuánto deja un evento

Presupuesto antes, gastos reales después y P&L del evento. En un evento corresponde a las etapas `01_presupuesto` y `06_cierre`. Aquí solo se lleva **el P&L de su propio evento**; el consolidado del negocio no vive en este repo.

Tareas con fechas: [tareas.md](tareas.md). Montos reales y facturas van en `private/` del evento (no se versionan).

## Principios

- **Ninguna cifra sale de cabeza.** Cada monto, porcentaje, margen y break even se calcula con el método de abajo y se muestra la cuenta.
- **Los sponsors no van como línea de costos o tickets.** Su única fuente es el registro de [sponsors](../sponsors/playbook.md).
- **Moneda local + USD.** Todo se guarda en la moneda del evento y se normaliza a USD con el tipo de cambio (TC) **del día del evento**. Eventos futuros usan el TC más reciente, marcado como provisional.
- **Tickets netos de Stripe.** Comisión real si viene en el export del admin; si no, se estima y la línea se marca `por revisar`.
- **Presupuesto vs real:** mismas líneas, dos escenarios (`budget`, `actual`).

## Presupuesto (etapa `01_presupuesto`)

Se arma desde los supuestos por ciudad (tab _P&L assumptions_ del Weekly Sync). Conceptos: precio del boleto, venue, catering, swag, premio de Dev Racing, marketing, viáticos (vuelo, hotel, comida, personas, noches).

| Concepto                | Regla                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personas                | Catering, swag y supplies: meta de asistentes + 10%, redondeado hacia arriba. Tickets: la meta sin colchón                                              |
| Boletos pagados         | Meta × (1 − % de cortesías de las últimas 3 ediciones reales de la ciudad; si no hay, del país; si no, de todas). Con cortesías dadas: meta − cortesías |
| Precio                  | El que da quien lidera; si no, el de los supuestos convertido                                                                                           |
| Venue                   | El monto que da quien lidera (0 = en especie); si no, el de los supuestos. Avisar si ya hay venue reservado                                             |
| Catering                | Personas × costo por persona de los supuestos                                                                                                           |
| Swag                    | 35 USD por persona                                                                                                                                      |
| Supplies (Costco/Sam's) | Gasto real por persona de las últimas ediciones de la ciudad o del país                                                                                 |
| Premio Dev Racing y ads | Monto por evento de los supuestos                                                                                                                       |
| Viáticos                | Personas que viajan × vuelo, y personas × noches × (hotel + comida). Se pregunta cada vez                                                               |
| Sponsors                | No se presupuestan como línea: se calcula el **break even**                                                                                             |

**Break even de sponsors** = costos − tickets netos. Se compara con la meta de sponsors, con lo confirmado y con confirmado + pendiente. **El número a conseguir es el break even**, no el margen presupuestado (que suma confirmados y pendientes).

### Flujo

1. Identificar el evento. Sin fecha no se puede presupuestar.
2. Preguntar en un solo mensaje: quién viaja y cuántas noches, precio del boleto, costo del venue, cortesías.
3. **Borrador** en moneda local y USD: costos por categoría, tickets netos, break even contra meta y confirmado, alertas.
4. Solo con el OK de quien lidera se guarda en `01_presupuesto/output/` y se pregunta si se marca T097.

**Alertas a revisar:** % de cortesías o supplies tomado de otra ciudad, precio convertido en vez de dado, venue reservado que podría ser en especie, falta de historial de supplies, meta de sponsors por debajo del break even, evento tentativo, líneas que no vienen de los supuestos.

**Regla de reemplazo:** al rehacer un presupuesto se reemplazan solo las líneas calculadas. Las cotizaciones y montos dados por quien lidera se conservan.

## Tipo de cambio y Stripe

- TC: unidades locales por 1 USD, de la fecha del evento. Una tasa guardada no se sobrescribe. Fuente usada hasta ahora: `fawazahmed0/currency-api` (gratis, sin API key, histórico diario). `por confirmar` si esta ciudad lo usa.
- ARS usa el tipo oficial de esa fuente: validarlo contra el BCRA al cerrar un evento en Buenos Aires.
- Comisión de Stripe estimada = cantidad × (precio × % + fijo) × (1 + IVA sobre comisión). El % se verificó contra un export real; los fijos de COP, CLP y ARS están **sin verificar**. Los valores vigentes: `por confirmar` (no están en la fuente).

## Cierre financiero (etapa `06_cierre`)

1. Registrar **todos los gastos reales** (T089). El evento no se cierra sin ellos.
2. Enviar info de pago para reembolsos y tickets para facturar (T082); el OOS manda la foto del ticket el día anterior (T077).
3. Llenar el P&L del evento (T090).

**P&L del evento:** ingreso = sponsors (presupuestado o cobrado) + tickets netos + otros ingresos. Contribución = ingreso − costos. Margen = contribución / ingreso. Costo por asistente = costo real / asistentes que hicieron check-in.

Alertas: TC provisional, moneda sin TC, líneas por revisar, deals confirmados sin monto.

## Por confirmar

- Valores de Stripe (% e IVA) y de los supuestos por ciudad: están en el tab del Weekly Sync, no en este repo. Hace falta una copia para la ciudad nueva.
- Si el evento es community-led, ver [variante](../../variantes/community-led.md): el presupuesto apunta a break even.
