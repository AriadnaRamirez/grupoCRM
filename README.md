# Grupo CRM Extintores — maqueta HTML/CSS/JS

Sitio estático institucional (sin carrito ni checkout). Cuando esté listo, se porta a WordPress.

## Local

```bash
npm start
```

Abre **http://localhost:5500** (`serve` usa URLs limpias: `/nosotros` → `nosotros.html`).

| Página | Archivo |
| --- | --- |
| Inicio | `index.html` |
| Nosotros | `nosotros.html` |
| Productos | `productos.html` |
| Ficha | `producto.html?sku=CRM-0001` |
| Servicios | `servicios.html` |
| Galería | `galeria.html` |
| Contacto | `contacto.html` |
| Aviso de privacidad | `aviso-privacidad.html` |
| Mapa de sitio | `mapa-sitio.html` |
| 404 | `404.html` |
| Blog | `blog/index.html` |

El catálogo vive en `js/data.js`. WhatsApp: 55 5438 3241.

Antes de publicar:

```bash
npm run check:assets
```

## SEO

```bash
npm run seo:sitemap
```

Genera `sitemap.xml` (incluye fichas, categorías y aviso de privacidad). `robots.txt` ya apunta a ese sitemap.

## Contenido

- Textos y productos: `js/data.js`
- Paleta y tipografía: `css/tokens.css`
- Componentes: `css/main.css`

## Producción

El menú y el sitemap usan URLs limpias (`/nosotros`, `/productos`, `/blog/...`). Hay que publicar en un host que las resuelva a los `.html`:

- **Netlify** — `netlify.toml` (sin instalar `sharp`/`onnx` en el build), `_headers`, `_redirects`
- **Cloudflare Pages** — `_headers` y `_redirects`; build vacío, publicar la raíz
- **Vercel** — `vercel.json` con `cleanUrls`
- **Apache / cPanel** — `.htaccess` reescribe `/nosotros` → `nosotros.html`

No uses GitHub Pages en un subpath (`usuario.github.io/repo/`): las rutas `/css` y `/productos` no coincidirían.

Tras el DNS: HTTPS, HTTP→HTTPS, Search Console y Analytics. Las cabeceras (nosniff, Referrer-Policy, SAMEORIGIN) ya van en `_headers` / `netlify.toml`.
