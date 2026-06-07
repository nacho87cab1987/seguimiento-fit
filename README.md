# Mi seguimiento — app de fitness y nutrición

App personal para registrar comidas, entrenamientos, peso, fotos de progreso, racha y actividad.
Los datos se pueden guardar en una **base de datos** para tenerlos iguales en todos tus dispositivos.

## Probar en tu compu

Necesitás Node.js (https://nodejs.org).

```bash
npm install
npm run dev      # abre http://localhost:5173 (usa el navegador para guardar)
```

## Subir a Vercel

1. Entrá a https://vercel.com e iniciá sesión.
2. Instalá la CLI: `npm i -g vercel`
3. En esta carpeta: `vercel` y seguí los pasos. Te queda una URL fija.

Hasta acá ya funciona, pero guarda en el navegador de cada dispositivo.
Para que guarde en una base de datos (mismos datos en celu y compu), seguí lo de abajo.

## Activar la base de datos (Redis / Upstash) — GRATIS

1. En tu proyecto de Vercel: pestaña **Storage** → **Create / Connect Database**.
2. Elegí **Redis** (proveedor **Upstash**) y conectalo al proyecto.
   Vercel inyecta solo las credenciales (`KV_REST_API_URL` y `KV_REST_API_TOKEN`).
3. Volvé a desplegar: en **Deployments**, "Redeploy".

Listo: la app detecta la base de datos sola y empieza a guardar ahí. En la pantalla
**Progreso → Respaldo de datos** vas a ver "Guardando en: base de datos (servidor)".

## Clave de acceso (MUY recomendado)

Sin clave, cualquiera con el link puede ver tus datos y fotos. Para protegerlo:

1. En Vercel: tu proyecto → **Settings → Environment Variables** → agregá:
   - Name: `APP_PASSWORD`
   - Value: una clave que elijas
2. Redeploy.

Ahora la app pide esa clave al entrar. Se guarda en tu dispositivo para no tener que
escribirla cada vez.

## Comparación de fotos con IA (opcional)

El botón "Comparar con IA" necesita una clave de Anthropic:

1. Sacá una API key en https://console.anthropic.com (servicio pago por uso).
2. En Vercel → Settings → Environment Variables → agregá `ANTHROPIC_API_KEY` con tu clave.
3. Redeploy.

Sin esa clave, todo lo demás funciona igual; solo ese botón avisa que falta configurarla.

## Respaldo

Aunque uses base de datos, conviene exportar de vez en cuando desde
**Progreso → Respaldo de datos → Exportar** y guardar ese archivo.
