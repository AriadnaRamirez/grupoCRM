# Grupo CRM Extintores

Sitio corporativo de [Grupo CRM Extintores](https://www.crmextintores.com.mx), desarrollado como presencia digital comercial para venta, recarga, mantenimiento e instalación de extintores en Ciudad de México y Estado de México.

El proyecto está diseñado como un sitio estático de alto control editorial: no usa carrito, checkout ni backend propio. La conversión principal es contacto directo por WhatsApp y teléfono.

## Objetivo Del Proyecto

Presentar a Grupo CRM Extintores como proveedor confiable de equipo contra incendio, reforzando:

- Oferta de productos y servicios.
- Cobertura por alcaldías y municipios.
- Catálogo consultable por categoría.
- Contenido editorial orientado a búsquedas orgánicas.
- Casos, fotografías y señales de confianza.
- Rutas limpias listas para indexación.

## Alcance

El sitio incluye:

- Home institucional.
- Catálogo de productos.
- Fichas dinámicas por SKU.
- Páginas de servicios.
- Página de empresa.
- Galería.
- Blog.
- Landing pages locales.
- Sitemap, robots y metadatos SEO.
- Configuración de despliegue en Vercel.

## Estructura Principal

- `index.html`: página principal.
- `nosotros.html`: información de empresa, servicios y confianza.
- `productos.html`: catálogo general.
- `producto.html`: ficha de producto por `sku`.
- `blog/`: artículos y guías.
- `extintores-*.html`: páginas locales.
- `zonas/`: rutas auxiliares de cobertura.
- `assets/`: imágenes, logos, galería, catálogo y fuentes.
- `css/tokens.css`: variables visuales del sistema de diseño.
- `css/main.css`: estilos fuente.
- `css/main.min.css`: CSS de producción.
- `js/data.js`: contenido estructurado del negocio.
- `js/ui.js`: componentes, navegación e interacción.
- `js/app.min.js`: bundle de producción.
- `vercel.json`: configuración única de despliegue.

## Identidad Y Experiencia

El diseño conserva la identidad visual de la marca: encabezado comercial, accesos a llamada y WhatsApp, catálogo visual, secciones de confianza, galería y formularios de contacto por WhatsApp.

Las fotografías de instalaciones y espacios reales deben conservar encuadre inferior cuando se recortan en tarjetas o banners, para mantener contexto visual del sitio.

## Desarrollo Local

```bash
npm start
```

Abrir:

```text
http://localhost:5500
```

## Scripts De Operación

```bash
npm run minify
npm run check:assets
npm run seo:links
npm run seo:images
npm run audit:images
npm run seo:sitemap
```

Antes de publicar una versión:

```bash
npm run minify
npm run check:assets
npm run seo:links
```

## Despliegue En Vercel

El proyecto se despliega exclusivamente en Vercel.

Configuración principal:

- Archivo: `vercel.json`.
- Salida publicada: raíz del repositorio.
- Build command: vacío o no requerido.
- Output directory: raíz del proyecto.
- Clean URLs: gestionadas por rewrites y redirects en `vercel.json`.
- Headers de seguridad y cache: configurados en `vercel.json`.

Después de desplegar:

1. Confirmar dominio `www.crmextintores.com.mx`.
2. Confirmar HTTPS activo.
3. Validar redirecciones de `.html` hacia rutas limpias.
4. Revalidar `sitemap.xml` y `robots.txt`.
5. Ejecutar PageSpeed Insights sobre la URL final desplegada.
6. Revisar Search Console después de la publicación.

## Calidad Y Producción

Checklist operativo:

- Catálogo sin imágenes faltantes.
- Enlaces internos sin roturas.
- Logo de marca con texto alternativo.
- CSS y JS minificados.
- Cache bust actualizado cuando cambian assets productivos.
- Sitemap actualizado cuando cambian páginas indexables.
- Configuración de despliegue limitada a Vercel.

## Mantenimiento

Para actualizar catálogo, textos o teléfonos:

1. Editar `js/data.js`.
2. Verificar assets relacionados en `assets/`.
3. Ejecutar `npm run minify`.
4. Ejecutar `npm run check:assets`.
5. Ejecutar `npm run seo:links`.
6. Actualizar `sitemap.xml` cuando se agreguen o retiren páginas.

El sitio debe mantenerse como una presencia institucional profesional: claro, rápido, rastreable y enfocado en conversión por contacto directo.
