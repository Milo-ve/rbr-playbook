# Publicar el sitio en Cloudflare (con acceso por correo)

El sitio es una página que se reconstruye sola en cada cambio a `main` y que solo abren las personas autorizadas por correo. Se genera con `npm run site` a partir de los archivos de `eventos/`. Es de solo lectura: lo que se ve se cambia en el repositorio.

No hace falta un dominio propio: Cloudflare da una dirección gratuita (`*.workers.dev` o `*.pages.dev`). No uses el dominio de otro proyecto.

> Los nombres de los menús de Cloudflare cambian con el tiempo. Si algo no coincide, manda la documentación oficial. Lo que sí es de este repo, y no cambia, está en "Cómo está protegido".

## Costo

Cloudflare Access es gratis para equipos de menos de 50 usuarios; con más, cuesta por usuario. Confirma el plan vigente en la página de precios antes de crecer. GitHub Actions corre una revisión por cambio (cerca de un minuto) dentro de la cuota gratuita de repos privados.

## Cómo está protegido

1. **Interruptor `SITE_PUBLISH`.** Sin `SITE_PUBLISH=1` el sitio sale como una página "en preparación" **sin ningún dato del evento**.
2. **Solo la rama `main`.** En Cloudflare, una construcción que no sea de `main`, o cuya rama no se pueda identificar, sale vacía aunque `SITE_PUBLISH` esté puesto. Las vistas previas de ramas y pull requests nunca llevan datos. El registro de construcción dice qué decidió y por qué.
3. **Filtro de contenido.** La construcción falla si encuentra un correo, un teléfono o un monto (salvo el precio público del boleto). Las notas de texto libre de las tareas nunca se incluyen.
4. **Sin indexar.** Los encabezados piden que ningún buscador guarde la página.

## Pasos (una sola vez, los hace el dueño de la cuenta)

### 1. Crear el proyecto

Entra a **Compute → Workers & Pages → Create** y elige según lo que ofrezca Cloudflare. Autoriza la aplicación de GitHub **solo para el repositorio `rbr-playbook`**.

|                         | Ruta A: Workers (la que Cloudflare recomienda para proyectos nuevos)           | Ruta B: Pages                  |
| ----------------------- | ------------------------------------------------------------------------------ | ------------------------------ |
| Cómo                    | Importar un repositorio de Git                                                 | Connect to Git                 |
| Nombre                  | `rbr-playbook` (debe ser exactamente este: coincide con `wrangler.site.jsonc`) | el que quieras                 |
| Rama de producción      | `main`                                                                         | `main`                         |
| Comando de construcción | `npm ci && npm run build:site`                                                 | `npm ci && npm run build:site` |
| Comando de despliegue   | `npx wrangler deploy --config wrangler.site.jsonc`                             | (no tiene)                     |
| Carpeta de salida       | (la define `wrangler.site.jsonc`: `dist/site`)                                 | `dist/site`                    |

La versión de Node sale de `.node-version` (22). **No agregues `SITE_PUBLISH` todavía:** el primer despliegue sale vacío.

### 2. Proteger con Access

- En **Zero Trust → Settings → Authentication**, activa el método de código de un solo uso (One-time PIN).
- **Ruta A:** en el Worker, **Settings → Domains & Routes**, activa Cloudflare Access para la dirección `workers.dev` y para las vistas previas.
- **Ruta B:** en Zero Trust, **Access → Applications**, crea una aplicación autohospedada para `<proyecto>.pages.dev` y otra para `*.<proyecto>.pages.dev`.
- Política: permitir solo una lista de correos (o un dominio de correo). Los correos se escriben aquí, en Cloudflare, **nunca en este repositorio**. Define cuánto dura la sesión.

### 3. Comprobar antes de publicar datos

- Abre la dirección en una ventana privada: debe pedir tu correo y un código, no mostrar la página.
- Prueba con un correo que **no** esté en la lista: debe rechazarlo.
- Abre también una dirección de vista previa: debe pedir lo mismo.

### 4. Activar los datos

- En el proyecto, **Settings → Build → Variables** (Ruta B: Environment variables, ambiente Production): `SITE_PUBLISH` = `1`.
- Vuelve a desplegar `main`. En el registro de construcción debe aparecer: `con datos … rama main en Cloudflare`.
- Si el sitio sigue vacío, ese mismo registro dice por qué (por ejemplo, `rama "desconocida"`). Avísale a Claude con esa línea.

## Apagar de emergencia

Quita `SITE_PUBLISH` y vuelve a desplegar: el sitio queda vacío en un minuto. Para cortar el acceso de una persona, quítala de la política de Access.

## Qué se actualiza solo y qué no

- Las tareas, sponsors, equipo y etapas se actualizan con cada cambio a `main`.
- Los días que faltan y las tareas vencidas se calculan con la fecha de quien abre la página.
- "Datos al" muestra el día de la última construcción.
- Los montos, las facturas, los presupuestos y todo lo que esté en `private/` nunca llegan al sitio.
