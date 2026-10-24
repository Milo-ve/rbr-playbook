# RBR Playbook

Sistema para operar y replicar eventos de Release Before Ready (RBR) en cualquier ciudad, empezando por los eventos community-led. Primer evento: San Luis Potosí, 2026-11-28.

Este archivo solo dice dónde está cada cosa. El contenido vive en las carpetas.

## Dónde estoy

| Carpeta                        | Qué es                                                                     |
| ------------------------------ | -------------------------------------------------------------------------- |
| `_playbook/`                   | **Fábrica.** Cómo se hace cada pilar. Estable, sirve para cualquier ciudad |
| `_templates/evento/`           | **Molde.** Se copia para crear una ciudad nueva                            |
| `eventos/<AAAA-MM-DD-CIUDAD>/` | **Producto.** Un evento real, con su trabajo etapa por etapa               |
| `_index/eventos.md`            | Lista de eventos y su estado. Se genera con script, no se edita            |
| `setup/`                       | Cuestionario de ciudad nueva                                               |
| `_private/`                    | Fuera de git: documentos fuente, finanzas, exports                         |

## A dónde voy según la tarea

| Quiero…                     | Voy a                                   |
| --------------------------- | --------------------------------------- |
| Entender el sistema         | `CONTEXT.md`                            |
| Crear una ciudad nueva      | `setup/questionnaire.md`                |
| Trabajar en un evento       | `eventos/<id>/CLAUDE.md`                |
| Saber cómo se hace un pilar | `_playbook/pilares/<pilar>/playbook.md` |
| Ver reglas, roles o voz     | `_playbook/shared/`                     |

Pilares: núcleo, adquisición, sponsors, operaciones, participantes, finanzas.

## Reglas duras

1. Nunca se guardan datos personales de participantes. Solo agregados.
2. Nada se envía ni se publica: se deja listo para que una persona lo apruebe.
3. Un dato vive en un solo lugar; lo demás enlaza.
4. Lo que no esté respaldado por una fuente se marca `por confirmar`.
5. Cada salida es un archivo editable; la siguiente etapa lee lo que la persona dejó.

## Estado

Se lee escaneando `eventos/*/NN_*/output/`. No hay archivo de estado a mano.
