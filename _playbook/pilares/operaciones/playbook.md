---
type: playbook
pilar: operaciones
fuente: PM docs 04-operaciones (2026-10-24)
---

# Operaciones: que el día salga

Sede, comida, snacks, swag, supplies, staff en sitio y el guion del día. Es el pilar con más tareas. Lo lleva Ops Central con el MC y el Ops On-Site (OOS) de cada ciudad. En un evento corresponde a la etapa `04_operaciones`.

Tareas con fechas: [tareas.md](tareas.md). Guion del día: [piezas/run-of-show.md](piezas/run-of-show.md).

## Proveedores de un evento

Un evento registra en `04_operaciones/output/proveedores.md` quién da qué:

| Categoría | Normalmente                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| Venue     | Uno por evento. Una sede con varias ubicaciones cuenta cada ubicación por separado |
| Catering  | Uno o varios; anotar qué da cada uno (comida, café, cervezas…)                     |
| Swag      | Uno o varios                                                                       |

El estado de cada proveedor **no se guarda en una columna**: se lee de las tareas (venue reservado = T033, caterer elegido = T042, swag = T059/T061/T062).

### Indicaciones propias de un proveedor

Un proveedor puede cambiar una tarea general (texto, rol o fecha) o agregar una extra. Ejemplo documentado, Flexoffices Juárez (CDMX): mandar el formato de proveedores a −7 días (T035), la lista de asistentes a −7 en vez de −2 (T037) y la lista actualizada a −1 (extra).

- En catering y swag conviene **no** reemplazar una tarea general si el evento puede tener varios proveedores: cambiaría la tarea para todos. Mejor agregar una tarea extra.
- Si dos proveedores cambian la misma tarea, se resuelve a mano.

## Staff

- Roles: MC, OOS, `mc+oos` (una persona con los dos) y voluntarios (ex-asistentes RBR). Ver [roles](../../shared/roles.md).
- MC y OOS son de la comunidad local. Ops Central y Partnerships son del equipo RBR.
- Cada rol tiene su guía (Guía MC, Guía OoS); T054 confirma que la leyeron.
- Sin MC u OOS asignado el evento está en 🔴 de staff (`mc+oos` cuenta para ambos).

## Por área

### Venue

Orden: buscar y validar specs (solo ciudad nueva) → revisar directorio → validar disponibilidad y costo → reservar → confirmar contacto y acceso → compartir proveedores → pagar → lista de asistentes → espacio ordenado un día antes. El anticipo se paga solo si el venue lo pide.

### Catering y snacks

Cantidad = capacidad + 10-15%. Pedir 2-3 cotizaciones, elegir, definir respaldo, agendar entrega (comer a la 1pm) y compartir contactos con el venue y el OOS. Los snacks del día los compra el OOS (Costco, según lista, T076) y los entrega en la sede (T078). **Foto del ticket el mismo día** (T077) para facturación o reembolso.

### Supplies

Cotizar según la lista estándar y la capacidad (Supplies Playbook), pedir a −3 días, recibir en el venue a −1.

### Swag

Número de piezas = confirmados + 15%. Elegir item, diseñar 3 opciones con los sponsors confirmados, pedir factura y pagar, enviar para que llegue máximo 2 días antes, recibir y organizar por tallas. Las tallas salen del export del admin.

### MC y OOS

Tareas propias en [tareas.md](tareas.md) (T069-T078). El MC prepara el morning deck, valida perks y equipo técnico y aprende el admin. El OOS coordina entrega y acceso, imprime stickers, compra y entrega snacks.

### Post-evento

Fotos y videos a la carpeta de la ciudad, guardar swag sobrante, retro a +7 y cerrar a +14.

## Medir

- Proveedores del evento: 🏢 venue · 🍽️ catering · 👕 swag (nombre o "—").
- Datos que faltan: venue, catering o swag en cada evento futuro sin ese proveedor; MC u OOS si falta staff.
- Prioridad: sin venue o sin MC/OOS es de lo primero. Swag y catering en eventos a 30 días o menos van después.
- Hitos: venue reservado (T033), MC y OOS asignados (T052), caterer elegido (T042), swag elegido, pagado y enviado (T059, T061, T062), voluntarios (T053).

## Por confirmar

- T047 (pedidos de Comebien) estaba marcada solo para CDMX en el texto pero se generaba en todos los eventos. Aquí se condicionó a `ciudad:CDMX`; confirmar con Regina.
- Guía MC, Guía OoS, Supplies Playbook, morning deck y directorios de venues y caterers: viven fuera de este repo y falta incorporarlos.
