---
type: playbook
pilar: adquisicion
fuente: PM docs 02-adquisicion (2026-10-24)
---

# Adquisición: que llegue gente

Activar el evento, promoverlo en redes, WhatsApp y correo, y medir el registro contra la meta. En un evento corresponde a la etapa `02_adquisicion`.

Tareas con fechas: [tareas.md](tareas.md). Formatos de cada pieza: [piezas/formatos.md](piezas/formatos.md). Voz: [../../shared/voz.md](../../shared/voz.md).

## Flujo del kit de materiales

Objetivo: que quien lidera copie, pegue y publique sin corregir datos.

1. **Ficha del evento.** Junta lo que ya se sabe: fecha en español (y en inglés si aplica), días y semanas que faltan, idioma (ES para LatAm, EN para SF), venue, sponsors confirmados con sus perks, pendientes y huecos.
2. **Preguntar, todo en un mensaje.** Siempre el **giro de la edición** (lo que la hace distinta: "primera edición en la ciudad", "antes de la Tech Week"), horario, precio y link de registro, más los perks que falten. No se produce nada sin giro, horario, precio y link. Si el evento no está `confirmed`, se avisa antes.
3. **Textos** con la guía de voz y 2-3 ejemplos recientes de tono.
4. **Textos para flyers.** Los diseña el equipo; aquí solo se entrega el texto.
5. **Guion de video.** Lo graba el equipo; aquí solo el guion.
6. **Entrega** en `eventos/<id>/02_adquisicion/output/materiales.md`.
7. **Cierre.** Se muestran el blurb y el correo completos. Se pregunta antes de marcar T004, T005, T008 o T012 como hechas.

## Reglas de contenido

- Cada pieza lleva fecha con día de la semana, horario, ciudad y venue, precio, link y sponsors por nombre con sus perks. **Nunca montos de deals.**
- Sponsors `pending` no aparecen salvo que lo confirme quien lidera. Sin perk, el sponsor se nombra en el agradecimiento.
- El giro se nota en todas las piezas, distinto en cada una. Prueba antes de entregar: si el copy se podría publicar en otra edición cambiando solo la fecha, es genérico.
- Si el giro es otro evento, se piden sus hashtags.
- Los perks que se confirmen se guardan en `03_sponsors`, no aquí.
- Nunca se envía ni se publica nada. Solo se deja listo.

## Medir el registro

Fuente mientras no exista API: el export CSV del RBR admin. **El export trae nombres y correos: no entra al repo.** Se guarda fuera de git (`_private/` o `inbox/`) y aquí solo se anotan agregados en `output/registro.md`:

| Dato               | Qué es                                               |
| ------------------ | ---------------------------------------------------- |
| Aplicaciones       | Filas del export                                     |
| Pagados            | Sin contar cortesías                                 |
| Cortesías          | Boletos de cortesía                                  |
| Pago pendiente     | Estado `AUTH_PENDING`                                |
| Fecha del snapshot | Cada foto es histórica: se agrega, no se sobrescribe |

Limitación conocida: el export solo trae aplicaciones `PAID` y `AUTH_PENDING`; no las rechazadas ni las que están en revisión.

Registrados = pagados + cortesías del último snapshot.

**Semáforo de tickets** (registrados vs meta de asistentes): 🟢 ≥80% · 🟡 50-79% · 🔴 <50% · ⚪ sin export. Ver [semaforos](../../shared/semaforos.md).

**Alertas de datos:** falta export si el evento es futuro y no hay ninguno; export viejo si el último tiene más de 3 días. Un evento a 30 días o menos sin export es un punto ciego.

**Hitos a vigilar:** evento activo en el admin (T002), artes (T005), primer correo (T008), campañas de Instagram y LinkedIn (T006, T007) y recordatorio (T012).

## Lecciones de ediciones anteriores

- Los calendarios de redes de los eventos recientes se manejaron en una herramienta de programación (Metricool) y los borradores hay que aprobarlos ahí para que se publiquen. `por confirmar` si la nueva ciudad usará la misma herramienta.
- Algunas ediciones omitieron el horario en las piezas por decisión de quien lideraba. Es una decisión explícita, no un descuido.

## Por confirmar

- Referencias reales de tono (el blurb de Medellín y el LinkedIn de CDMX 24/oct): hoy solo existe un resumen en [voz.md](../../shared/voz.md).
- Herramienta de programación de redes para ciudades nuevas.
