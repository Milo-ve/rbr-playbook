# Empieza aquí

Esta carpeta es todo lo que hace falta para operar un evento de Release Before Ready (RBR). No necesitas saber programar.

## Cómo se usa

1. Abre esta carpeta con Claude (Claude Code o Cowork).
2. Dile quién eres y qué necesitas. Por ejemplo: "Soy el MC de San Luis Potosí, ¿qué me toca esta semana?"
3. Claude lee solo lo que necesita, te propone el trabajo y lo deja en un archivo para que lo revises.
4. **Nada se envía ni se publica solo.** Tú revisas, editas y mandas.

## ¿Quién eres?

| Soy…                          | Lee primero                                                   | Tus tareas                                |
| ----------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| **MC / host**                 | `eventos/<tu evento>/05_dia-del-evento/CONTEXT.md`            | Las de rol `mc` en `tareas-del-evento.md` |
| **OOS** (operación en sede)   | `eventos/<tu evento>/04_operaciones/CONTEXT.md`               | Las de rol `oos`                          |
| **Voluntario**                | `eventos/<tu evento>/05_dia-del-evento/output/run-of-show.md` | Las que te asigne el OOS                  |
| **Ops Central**               | `eventos/<tu evento>/CLAUDE.md`                               | Las de rol `ops_central`                  |
| **Partnerships**              | `eventos/<tu evento>/03_sponsors/CONTEXT.md`                  | Las de rol `partnerships`                 |
| **Líder de una ciudad nueva** | `setup/questionnaire.md`                                      | Ver abajo                                 |

## Quiero crear un RBR en mi ciudad

1. Contesta `setup/questionnaire.md`.
2. Pídele a Claude que cree el evento con tus respuestas, o corre:
   `npm run stamp -- --ciudad "Tu Ciudad" --codigo ABC --fecha AAAA-MM-DD --moneda MXN --ciudad-nueva --modelo community-led`
3. Se crea `eventos/<fecha>-<ciudad>/` con todas las etapas y una lista de tareas con fechas.
4. Empieza por `00_alta`, luego `01_presupuesto`: el presupuesto va antes que venue y capacidad.

## Lo que necesitas saber

- **Cada etapa tiene su `CONTEXT.md`** con qué lee, qué hace, qué escribe y qué revisas tú.
- **Las tareas** vienen en `tareas-del-evento.md`, con fecha y responsable. Marca `[x]` al terminar.
- **El estado** se ve en `_index/eventos.md`.
- **Montos, facturas y exports** van en la carpeta `private/` del evento. No se comparten.
- **Nunca** se guardan datos personales de participantes. Solo conteos.
- **Si algo no está confirmado**, el archivo dice `por confirmar`. No lo tomes como hecho.

## Si algo no está claro

Pregúntale a Claude por el pilar: "¿cómo se hace la parte de sponsors?" o "¿qué hago con los snacks?". La respuesta sale de `_playbook/pilares/`.
