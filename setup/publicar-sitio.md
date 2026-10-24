# Publicar el sitio (Cloudflare Pages + Access)

El sitio es una página que se reconstruye sola en cada cambio a `main` y que solo abren las personas autorizadas por correo. Se genera con `npm run site` a partir de los archivos de `eventos/`. Es de solo lectura: lo que se ve se cambia en el repositorio.

> Los pasos de la interfaz de Cloudflare cambian de nombre con el tiempo. Si algo no coincide, manda la documentación oficial de Cloudflare Pages y de Cloudflare Access. Lo que sí es de este repo, y no cambia, está en la sección "Cómo está protegido".

## Costo

Cloudflare Access es gratis para equipos de menos de 50 usuarios; con más, cuesta por usuario. Confirma el plan vigente en la página de precios de Cloudflare antes de crecer. GitHub Actions corre una revisión por cambio (cerca de un minuto) dentro de la cuota gratuita de repos privados.

## Cómo está protegido

1. **Interruptor `SITE_PUBLISH`.** Sin `SITE_PUBLISH=1` el sitio sale como una página "en preparación" **sin ningún dato del evento**. Se activa solo después de comprobar que el acceso funciona.
2. **Solo en Production.** Los despliegues de vista previa (ramas y pull requests) tienen una dirección pública distinta. Por eso `SITE_PUBLISH=1` se pone únicamente en el ambiente **Production**: las vistas previas siempre salen vacías.
3. **Filtro de contenido.** La construcción falla si encuentra un correo, un teléfono o un monto (salvo el precio público del boleto). Las notas de texto libre de las tareas nunca se incluyen.
4. **Sin indexar.** Los encabezados piden que ningún buscador guarde la página.

## Pasos (una sola vez, los hace el dueño de la cuenta)

**1. Crear el proyecto en Cloudflare Pages**

- Cuenta gratuita de Cloudflare, sección Workers & Pages, crear un proyecto desde Git.
- Autoriza la aplicación de GitHub solo para el repositorio `rbr-playbook`.
- Rama de producción: `main`. Comando de construcción: `npm ci && npm run build:site`. Carpeta de salida: `dist/site`.
- La versión de Node sale de `.node-version` (22).
- **No agregues `SITE_PUBLISH` todavía.** Ese primer despliegue sale vacío.

**2. Proteger con Access**

- En Zero Trust, activa el método de acceso por código de un solo uso (One-time PIN).
- Crea una aplicación de Access para la dirección del sitio (`<proyecto>.pages.dev`) y para las vistas previas (`*.<proyecto>.pages.dev`).
- Política: permitir solo las personas de una lista de correos, o de un dominio de correo. Define cuánto dura la sesión.

**3. Comprobar antes de publicar datos**

- Abre la dirección en una ventana privada: debe pedir tu correo y un código, no mostrar la página.
- Prueba con un correo que **no** esté en la lista: debe rechazarlo.
- Abre también una dirección de vista previa: debe pedir lo mismo.

**4. Activar los datos**

- En el proyecto, variables de entorno, ambiente **Production**: `SITE_PUBLISH` = `1`.
- Vuelve a desplegar. A partir de aquí cada cambio a `main` actualiza el sitio.

## Apagar de emergencia

Quita `SITE_PUBLISH` del ambiente Production y vuelve a desplegar: el sitio queda vacío en un minuto. Para cortar el acceso de una persona, quítala de la política de Access.

## Qué se actualiza solo y qué no

- Las tareas, sponsors, equipo y etapas se actualizan con cada cambio a `main`.
- Los días que faltan y las tareas vencidas se calculan con la fecha de quien abre la página.
- "Datos al" muestra el día de la última construcción.
- Los montos, las facturas y todo lo que esté en `private/` nunca llega al sitio.
