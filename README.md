# Grupo CRM Extintores

Sitio institucional estático de [www.crmextintores.com](https://www.crmextintores.com): venta, recarga e instalación de extintores en CDMX y Estado de México. Sin carrito ni checkout; las cotizaciones van por WhatsApp.

## Local

```bash
npm start
```

Abre **http://localhost:5500** (`serve` resuelve URLs limpias: `/nosotros` → `nosotros.html`).

| Página | Archivo |
| --- | --- |
| Inicio | `index.html` |
| Nosotros | `nosotros.html` |
| Productos | `productos.html` |
| Ficha | `producto.html?sku=CRM-0001` |
| Servicios | `servicios.html` → redirige a `nosotros.html#servicios` |
| Galería | `galeria.html` |
| Contacto | `contacto.html` |
| Aviso de privacidad | `aviso-privacidad.html` |
| Mapa de sitio | `mapa-sitio.html` |
| 404 | `404.html` |
| Blog | `blog/index.html` |

## Contenido

- Textos, teléfonos y catálogo: `js/data.js`
- Paleta, tipografía y espaciado: `css/tokens.css`
- Componentes: `css/main.css`

WhatsApp de cotización: 56 6748 1489.

## Antes de publicar

```bash
npm run check:assets
npm run seo:sitemap
```

`robots.txt` apunta a `sitemap.xml` (fichas, categorías y aviso de privacidad).

## Publicación

El menú y el sitemap usan URLs limpias (`/nosotros`, `/productos`, `/blog/...`). El host debe resolverlas a los `.html`.

Para el dominio **www.crmextintores.com** publique la raíz del repo:

- **Netlify** — `netlify.toml` (sin instalar dependencias en el build), `_headers`, `_redirects`
- **Cloudflare Pages** — `_headers` y `_redirects`; build vacío, publicar la raíz
- **Vercel** — `vercel.json` con `cleanUrls`
- **Apache / cPanel** — `.htaccess` reescribe `/nosotros` → `nosotros.html`

**GitHub Pages** queda como preview en `https://AriadnaRamirez.github.io/grupoCRM/` (base `/grupoCRM`). En el repo: Settings → Pages → Source: **GitHub Actions**.

Tras el DNS: HTTPS, HTTP→HTTPS, Search Console y Analytics. Las cabeceras (nosniff, Referrer-Policy, SAMEORIGIN) ya van en `_headers` / `netlify.toml`.
