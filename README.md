# RBR Playbook

Método y plantillas para operar un evento de Release Before Ready (RBR) en cualquier ciudad. Cada pilar (adquisición, sponsors, operaciones, participantes, finanzas) tiene su playbook, y cada evento es una carpeta con siete etapas. El primer evento es San Luis Potosí (2026-11-28), el primero community-led.

Si eres nuevo, lee [EMPIEZA-AQUI.md](EMPIEZA-AQUI.md). Para entender cómo se conecta todo, [CONTEXT.md](CONTEXT.md).

## Instalar y abrir con Claude Code

Necesitas Git, Node.js 22 o más nuevo y [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/Milo-ve/rbr-playbook.git
cd rbr-playbook
npm install
claude
```

Dentro de Claude dile quién eres y qué necesitas, por ejemplo: "Soy el MC de San Luis Potosí, ¿qué me toca esta semana?". Claude lee solo lo que hace falta y deja su trabajo en archivos para que lo revises. Nada se envía ni se publica solo.

## Crear una ciudad nueva

1. Contesta [setup/questionnaire.md](setup/questionnaire.md).
2. Pídele a Claude que cree el evento, o corre:
   ```bash
   npm run stamp -- --ciudad "Tu Ciudad" --codigo ABC --fecha AAAA-MM-DD --moneda MXN --ciudad-nueva --modelo community-led
   ```
3. Se crea `eventos/<fecha>-<ciudad>/` con siete etapas y una lista de tareas con fechas. Empieza por `00_alta` y `01_presupuesto`.

## Quién edita qué

| Quién                 | Edita                                                                      | No toca                                |
| --------------------- | -------------------------------------------------------------------------- | -------------------------------------- |
| Ops Central           | `_playbook/` y `_templates/` (el método), aprueba cambios al método        |                                        |
| Partnerships          | `03_sponsors/output/` de cada evento                                       | Montos y facturas: no van en este repo |
| MC, OOS y voluntarios | Las tareas de su rol y `04_operaciones` y `05_dia-del-evento` de su evento | `_playbook/` y `_templates/`           |
| Líder de una ciudad   | Solo la carpeta de su evento en `eventos/`                                 | Otros eventos                          |
| Nadie a mano          | `_index/eventos.md` y `dist/` (se generan)                                 |                                        |

Los cambios al método se proponen con una rama y un pull request, no directo en `main`. Antes de proponer un cambio corre `npm run check` y `npm test`.

## Montos y facturas viven fuera de git

**Nunca se suben a este repo:** montos de sponsors, facturas, datos de cobro, exports del RBR admin ni datos de participantes. Cada carpeta `private/` (en cualquier evento o etapa) y `_private/` están ignoradas por git: lo que pongas ahí se queda en tu computadora y **no se sincroniza**. Si otra persona necesita esos datos, compártelos por el canal seguro del equipo, no por el repositorio. `npm run check` avisa si aparece un monto en un archivo de sponsors versionado.

## Comandos

| Comando                                           | Qué hace                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `npm run stamp`                                   | Crea un evento nuevo desde la plantilla                                            |
| `npm run mark -- --evento ID --estado hecha T001` | Cambia el estado de una tarea                                                      |
| `npm run index`                                   | Reconstruye el índice de eventos                                                   |
| `npm run check`                                   | Revisa enlaces, contratos de etapa, tamaño de los archivos de entrada y privacidad |
| `npm run dashboard-data`                          | Genera los datos del tablero visual                                                |
| `npm test`                                        | Corre las pruebas                                                                  |
