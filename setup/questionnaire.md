# Cuestionario: ciudad nueva

Contesta lo que sepas. Lo que no sepas, déjalo en blanco: el sistema lo marca `por confirmar`. Con esto se crea el evento con `npm run stamp`.

## Para crear el evento (obligatorio)

| Pregunta                                         | Respuesta | Se usa como      |
| ------------------------------------------------ | --------- | ---------------- |
| Ciudad (nombre completo)                         |           | `--ciudad`       |
| Código de ciudad (2-4 letras, ej. SLP, QRO, BOG) |           | `--codigo`       |
| Fecha del evento (AAAA-MM-DD)                    |           | `--fecha`        |
| Moneda local: USD, MXN, COP, CLP, ARS, PEN o BRL |           | `--moneda`       |
| ¿Es la primera edición en la ciudad?             |           | `--ciudad-nueva` |
| Modelo: `estandar` o `community-led`             |           | `--modelo`       |
| Estado: `tentative` o `confirmed`                |           | `--estado`       |

Sin fecha no se pueden generar tareas ni presupuesto.

## Para completar `00_alta`

| Pregunta                                       | Respuesta |
| ---------------------------------------------- | --------- |
| Meta de asistentes                             |           |
| Meta de sponsors en USD (vacío si no hay meta) |           |
| MC / host: nombre                              |           |
| OOS: nombre                                    |           |
| Voluntarios: nombres                           |           |

## Para `01_presupuesto`

| Pregunta                                                       | Respuesta |
| -------------------------------------------------------------- | --------- |
| Precio del boleto                                              |           |
| Costo del venue (0 si es en especie o gratis)                  |           |
| ¿Cuántas cortesías se darán?                                   |           |
| ¿Quién viaja del equipo central y cuántas noches? (0 si nadie) |           |

## Para `02_adquisicion`

| Pregunta                                     | Respuesta |
| -------------------------------------------- | --------- |
| Giro de la edición (lo que la hace distinta) |           |
| Horario                                      |           |
| Link de registro                             |           |
| Perks de sponsors confirmados                |           |

## Para `04_operaciones`

| Pregunta                            | Respuesta |
| ----------------------------------- | --------- |
| Venue y contacto de la sede         |           |
| ¿Ya está reservado?                 |           |
| Catering y snacks: ¿quién y cuándo? |           |
| ¿Habrá swag? ¿Lo patrocina alguien? |           |
