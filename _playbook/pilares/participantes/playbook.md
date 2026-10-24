---
type: playbook
pilar: participantes
fuente: PM docs 05-participantes (2026-10-24)
---

# Participantes: quienes van a RBR

Cuántos llegan, cuántos regresan, qué talla de swag usan, qué opinan y cómo nos comunicamos con ellos. En un evento corresponde sobre todo a `06_cierre`, con tareas previas en `02_adquisicion`.

Tareas con fechas: [tareas.md](tareas.md).

## Regla de privacidad

**Nunca se guarda nombre, correo, teléfono ni perfil de un participante. Solo agregados.** Ver [privacidad](../../shared/privacidad.md).

- Los exports crudos del RBR admin se guardan **fuera de git** (`_private/` o `inbox/`).
- Las personas registradas en este repo son solo staff y equipo.
- Los reportes muestran conteos, nunca listas de asistentes.

## Qué se registra (en `06_cierre/output/participantes.md`)

| Dato     | Cómo sale                                                                                                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Check-in | Asistentes reales del día, del export final del admin                                                                                                                                  |
| Regresan | Asistentes que ya habían ido a una edición anterior. Se calcula cruzando correos contra exports previos **en local**; en el repo queda solo el número. Vacío si no hay exports previos |
| Tallas   | Conteo por talla (XS a XL+ y sin dato), para la orden de swag                                                                                                                          |
| NPS      | Respuestas, promotores, pasivos y detractores. Se captura del formulario de la encuesta                                                                                                |

## Medir

- **Retención** = regresan / check-in.
- **Costo por asistente** = costo real / check-in (ver [finanzas](../finanzas/playbook.md)).
- **Registro vs meta:** lo lleva [adquisición](../adquisicion/playbook.md).
- **Cortesías:** el presupuesto usa el % de cortesías de las últimas 3 ediciones reales de la ciudad.
- En el cierre, el **NPS va primero**, porque pierde respuestas rápido.

## Cierre (lo que toca a este pilar)

1. Subir el export final (T098): actualiza registro, check-in, retención y tallas.
2. Mandar el agradecimiento con encuesta de NPS (T084) al día siguiente.
3. Capturar el NPS.
4. Calcular métricas del evento (T091): asistencia, % de capacidad, NPS, costo por asistente.

## Por confirmar

- Hasta ahora ningún evento tiene NPS capturado: el flujo existe pero no se ha usado.
- Dónde vive el formulario de NPS para ciudades nuevas.
