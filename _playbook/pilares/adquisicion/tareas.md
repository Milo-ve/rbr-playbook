---
type: tareas
pilar: adquisicion
fuente: PM docs 02-adquisicion (2026-10-24)
---

# Tareas de adquisición

Fuente única de estas tareas. El script de alta del evento lee esta tabla. Formato del esquema: ver [../../CONTEXT.md](../../CONTEXT.md).

`Días` = relativo al evento (negativo = antes). `—` = sin fecha fija. `Condición` vacía = aplica siempre.

| ID   | Tarea                                                                        | Días | Rol          | Fase | Condición    |
| ---- | ---------------------------------------------------------------------------- | ---: | ------------ | ---- | ------------ |
| T001 | Confirmar la fecha del evento (habilita todo lo demás en eventos tentativos) |  -56 | ops_central  | pre  |              |
| T002 | Activar el evento en el RBR admin                                            |  -35 | ops_central  | pre  |              |
| T003 | Crear el grupo de WhatsApp del evento                                        |  -35 | ops_central  | pre  |              |
| T004 | Escribir el blurb con los detalles                                           |  -35 | partnerships | pre  |              |
| T005 | Crear los artes (considerar sponsors cerrados e irlos actualizando)          |  -35 | ops_central  | pre  |              |
| T008 | Primer correo a la base de datos (al activar)                                |  -35 | ops_central  | pre  |              |
| T009 | Anunciar en el grupo general de WhatsApp de RBR                              |  -35 | oos          | pre  |              |
| T006 | Lanzar campaña en Instagram                                                  |  -28 | ops_central  | pre  |              |
| T007 | Lanzar campaña en LinkedIn (cuenta 500 Latam)                                |  -28 | ops_central  | pre  |              |
| T010 | Invitar a la comunidad de 500                                                |  -28 | partnerships | pre  |              |
| T011 | Correo a aliados pidiendo apoyo de difusión                                  |  -28 | partnerships | pre  |              |
| T012 | Correo recordatorio a la base de datos                                       |  -28 | ops_central  | pre  |              |
| T013 | Conseguir 5-10 participantes por contactos directos                          |  -28 | partnerships | pre  | ciudad-nueva |
| T014 | Compartir a mano en grupos de WhatsApp                                       |  -21 | oos          | pre  |              |
| T015 | Esfuerzos de último minuto si va bajo 80%                                    |   -7 | partnerships | pre  |              |

Nota: T101 (post general post-evento) se fusionó en T086, en [sponsors](../sponsors/tareas.md).
