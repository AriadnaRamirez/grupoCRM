# Grupo CRM Extintores

Sitio institucional estático para [www.crmextintores.com.mx](https://www.crmextintores.com.mx). Presenta servicios, cobertura local, catálogo y contenido editorial para venta, recarga, mantenimiento e instalación de extintores en CDMX y Estado de México. No incluye carrito ni checkout: la conversión principal es contacto por WhatsApp y teléfono.

## Estado De Producción

La rama de trabajo publicada para revisión es `fix/home-catalog-four-cards-rb2`.

Cambios relevantes incluidos:

- Corrección del primer render para evitar destellos visuales antes de cargar los estilos principales.
- Catálogo del home con 4 artículos por sección en las categorías publicadas en “Más vendidos”.
- Regeneración de `css/main.min.css` y `js/app.min.js`.
- Cache bust de CSS/JS a `rb-2` para evitar que producción sirva assets antiguos.
- Corrección de `alt` del logo de marca en headers estáticos y scripts generadores.
- Validación de assets de catálogo, links internos e imágenes sin `alt`.

## Arquitectura

El sitio está construido con HTML estático, CSS propio y JavaScript modular empaquetado para producción.

- `index.html`: home.
- `nosotros.html`: empresa, servicios y contenido institucional.
- `productos.html`: catálogo completo con filtros.
- `producto.html`: ficha dinámica por `sku`.
- `blog/`: artículos editoriales.
- `extintores-*.html`: landing pages locales.
- `zonas/`: páginas limpias de cobertura.
- `js/data.js`: fuente principal de catálogo, servicios, empresa, FAQs y datos comerciales.
- `js/ui.js`: render de componentes, navegación, home, catálogo, sliders y formularios.
- `css/tokens.css`: sistema visual base.
- `css/main.css`: componentes y responsive.
- `css/main.min.css`: CSS de producción, con tokens incluidos.
- `js/app.min.js`: bundle de producción.

## Desarrollo Local

```bash
npm start
```

Abrir `http://localhost:5500`. El servidor usado por `serve` resuelve rutas limpias como `/nosotros` hacia `nosotros.html`.

## Scripts Operativos

```bash
npm run minify
npm run check:assets
npm run seo:links
npm run seo:images
npm run audit:images
npm run seo:sitemap
```

Uso recomendado antes de publicar:

```bash
npm run minify
npm run check:assets
npm run seo:links
```

## Auditoría Ejecutada

Última auditoría local en esta rama:

- `npm run minify`: genera `main.min.css` y `app.min.js` sin errores.
- `npm run check:assets`: 55 productos, 55 PNG de catálogo, sin faltantes.
- `npm run seo:links`: 111 HTML revisados, sin enlaces internos rotos.
- Revisión de `<img>`: 0 imágenes renderizadas sin atributo `alt`.
- Revisión del logo de header: 0 instancias `.brand` con `alt=""`.

Notas:

- `seo:images` reporta algunos `EMPTY_ALT` en plantillas JS decorativas, por ejemplo imágenes con `aria-hidden`, wordmark decorativo de footer o lightbox dinámico. No corresponden al logo principal del header.
- `audit:images` lista archivos pesados de galería y catálogo para seguimiento de performance. La mayoría son imágenes lazy o assets de galería, no todos forman parte del LCP.

## Catálogo En Home

El home muestra 3 secciones de catálogo en “Más vendidos”; cada sección entrega 4 productos:

- Extintores: `CRM-0003`, `CRM-0006`, `CRM-0012`, `CRM-0004`.
- Señalamiento vial: `CRM-0023`, `CRM-0030`, `CRM-0033`, `CRM-0024`.
- Equipo de protección: `CRM-0049`, `CRM-0050`, `CRM-0051`, `CRM-0052`.

La regla responsive de producción mantiene 4 columnas desde `768px` en el home y conserva 2 columnas en móvil.

## Publicación

Publicar la raíz del repositorio. El proyecto incluye configuración para:

- Netlify: `netlify.toml`, `_headers`, `_redirects`.
- Vercel: `vercel.json` con URLs limpias.
- Cloudflare Pages: `_headers` y `_redirects`.
- Apache / cPanel: `.htaccess`.
- GitHub Pages: preview con base `/grupoCRM`.

Después de desplegar:

- Confirmar HTTPS y redirección HTTP -> HTTPS.
- Revalidar Search Console.
- Ejecutar PageSpeed Insights contra la URL ya desplegada, no contra una versión cacheada.
- Verificar que CSS/JS se estén sirviendo con `?v=rb-2`.

## Mantenimiento

Cuando se modifique catálogo, textos o imágenes:

1. Actualizar `js/data.js` y los assets correspondientes.
2. Ejecutar `npm run minify`.
3. Ejecutar `npm run check:assets` y `npm run seo:links`.
4. Si cambia CSS/JS de producción, actualizar el cache bust con `scripts/bump-css-v.mjs`.
5. Confirmar que `sitemap.xml` y rutas limpias siguen consistentes.
