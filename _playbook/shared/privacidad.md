---
type: referencia
fuente: PM docs 02, 05, 06 (2026-10-24)
---

# Privacidad

## Participantes

**Nunca se guarda nombre, correo, teléfono ni perfil de un participante.** Solo agregados (conteos).

- Exports crudos del RBR admin: fuera de git, en `_private/` o `inbox/`.
- Retención se calcula en local cruzando exports; en el repo queda solo el número.
- Los reportes muestran conteos, nunca listas de asistentes.

## Personas del equipo

Solo nombre, ciudad y rol. Sin teléfonos personales ni datos de contacto.

## Dinero

- Montos de sponsors, facturas y datos de cobro van en `private/` dentro de la carpeta del evento. Está ignorado por git.
- Cada evento ve sus propias finanzas, no las de otros eventos.
- El P&L consolidado del negocio y el modelo de inversión no viven en este repo.

## Repo

Sin remote hasta que se decida explícitamente. Antes de publicar nada, revisar que no haya datos personales ni montos.
