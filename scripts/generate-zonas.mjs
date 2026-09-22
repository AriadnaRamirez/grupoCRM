import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  zonas,
  zonasCdmx,
  zonasEdomex,
  zonaBySlug,
  zonaRegionLabel,
  zonaTypeLabel,
  company,
  SITE,
} from "../js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "zonas");
const pagesBaseSnippet = `  <script src="/js/pages-base.js"></script>\n`;
const cssBoot = `  <style id="css-boot">
  /* css-boot: hide until local CSS + header are ready */
  html:not(.is-booted) { visibility: hidden; background: #fff; }
  </style>
  <noscript><style>html { visibility: visible !important; }</style></noscript>
  <script>setTimeout(function () { document.documentElement.classList.add("is-booted"); }, 4000);</script>
`;
const CACHE = "og-ratio";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function waHref(zona) {
  const region = zonaRegionLabel(zona);
  const text = `Hola, quiero cotizar extintores y equipo contra incendios en ${zona.name}, ${region}.`;
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

function nearbyLinks(zona) {
  const patterns = [
    (n) => `Extintores en ${n.name}`,
    (n) => `Servicio en ${n.name}`,
    (n) => `Atención en ${n.name}`,
    (n) => `Recarga en ${n.name}`,
  ];
  return (zona.nearby || [])
    .map((slug, i) => {
      const n = zonaBySlug(slug);
      if (!n) return "";
      const label = patterns[i % patterns.length](n);
      return `<li><a href="/zonas/${n.slug}">${escapeHtml(label)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n            ");
}

function gridItems(list) {
  return list
    .map(
      (z) =>
        `<li>
            <a href="/zonas/${z.slug}">
              <span class="zona-grid__tag">${escapeHtml(zonaTypeLabel(z))}</span>
              <strong>${escapeHtml(z.name)}</strong>
              <span>Venta, recarga e instalación</span>
            </a>
          </li>`
    )
    .join("\n          ");
}

function pageShell({ title, description, canonical, bodyAttrs, main }) {
  const origin = SITE.origin;
  return `<!DOCTYPE html>
<html lang="es-MX" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
${pagesBaseSnippet}${cssBoot}
  <link rel="stylesheet" href="/css/tokens.css?v=prod-20260903">
  <link rel="stylesheet" href="/css/main.css?v=${CACHE}">
  <script>document.documentElement.classList.add("is-css");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="${SITE.themeColor}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="es-MX" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="Grupo CRM Extintores">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}/assets/img/logo-crm.png">
  <meta property="og:image:alt" content="Logotipo de Grupo CRM Extintores">
  <meta property="og:image:width" content="720">
  <meta property="og:image:height" content="154">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${origin}/assets/img/logo-crm.png">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/img/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=optional" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=optional"></noscript>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" media="print" onload="this.media='all'" crossorigin="anonymous" referrerpolicy="no-referrer">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>
</head>
<body ${bodyAttrs}>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <div data-header></div>
  <main id="contenido">
${main}
  </main>
  <div data-footer></div>
  <script type="module" src="/js/main.js?v=${CACHE}" onerror="document.documentElement.classList.add('is-boot-error','is-booted')"></script>
</body>
</html>
`;
}

function hubHtml() {
  const title = "Extintores en CDMX y Estado de México | Grupo CRM";
  const description =
    "Venta, recarga e instalación de extintores en alcaldías de CDMX y municipios del Estado de México. Cotice con Grupo CRM Extintores.";
  const main = `  <section class="section zona-page zona-page--hub">
    <div class="wrap">
      <header class="zona-hub__head">
        <p class="kicker">Cobertura</p>
        <h1>CRM Extintores en CDMX y Estado de México</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">CRM Extintores atiende CDMX y Estado de México: las 16 alcaldías de la Ciudad de México y los principales municipios del Valle de México y zona Toluca. Elija su zona para cotizar venta, recarga e instalación de extintores.</p>
      </header>

      <section class="zona-hub__block" aria-labelledby="zona-cdmx">
        <div class="zona-hub__block-head">
          <h2 id="zona-cdmx">Ciudad de México</h2>
          <p>${zonasCdmx.length} alcaldías</p>
        </div>
        <ul class="zona-grid">
          ${gridItems(zonasCdmx)}
        </ul>
      </section>

      <section class="zona-hub__block" aria-labelledby="zona-edomex">
        <div class="zona-hub__block-head">
          <h2 id="zona-edomex">Estado de México</h2>
          <p>${zonasEdomex.length} municipios</p>
        </div>
        <ul class="zona-grid">
          ${gridItems(zonasEdomex)}
        </ul>
      </section>

      <p class="zona-page__more muted">Además del mapa de cobertura, puede revisar el <a href="/productos">catálogo de extintores</a>, nuestros <a href="/nosotros#servicios">servicios contra incendios</a>, la <a href="/galeria">galería de instalaciones</a> o el <a href="/blog/extintores-cdmx">blog de extintores en CDMX</a>.</p>
      <p class="zona-page__cta">
        <a class="btn btn-wa" href="https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hola, quiero cotizar extintores en CDMX o Estado de México.")}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Cotizar por WhatsApp</a>
        <a class="btn btn-ink" href="/contacto">Pedir cotización</a>
      </p>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical: `${SITE.origin}/zonas`,
    bodyAttrs: 'data-page="zonas"',
    main,
  });
}

function zonaHtml(zona) {
  const region = zonaRegionLabel(zona);
  const type = zonaTypeLabel(zona);
  const title = `CRM Extintores en ${zona.name} | Grupo CRM Extintores`;
  const description = `Venta, recarga e instalación de extintores en ${zona.name}, ${region}. Primera visita sin costo. Cotice con Grupo CRM Extintores.`;
  const isHome = zona.slug === "cuajimalpa";
  const serviceLead = isHome
    ? `CRM Extintores tiene su oficina en Chamixto 131, Col. Loma del Padre, ${zona.name}. Desde ahí atendemos empresas, condominios y oficinas con equipos certificados, recarga bajo NOM-154-SCFI-2005 e instalación en sitio.`
    : `CRM Extintores atiende ${zona.name} desde Cuajimalpa para dejar su empresa, condominio u oficina lista ante Protección Civil. Cotizamos equipos certificados, recarga bajo NOM-154-SCFI-2005 e instalación en sitio.`;
  const nearbyTitle = zona.region === "edomex" ? "Zonas cercanas" : "Alcaldías y zonas cercanas";
  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <p class="article-crumb"><a href="/">Inicio</a> · <a href="/zonas">Cobertura CDMX y Edo. Mex</a> · ${escapeHtml(zona.name)}</p>
        <p class="kicker">${escapeHtml(type)} · ${escapeHtml(region)}</p>
        <h1>CRM Extintores en ${escapeHtml(zona.name)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">CRM Extintores en ${escapeHtml(zona.name)} ofrece venta, recarga e instalación de extintores y equipo contra incendios en ${escapeHtml(region)}. Atendemos ${escapeHtml(zona.focus)}.</p>
      </header>
      <div class="zona-page__body">
        <h2>Servicio local en ${escapeHtml(zona.name)}</h2>
        <p>${escapeHtml(serviceLead)}</p>
        <ul class="zona-page__points">
          <li>Extintores PQS, CO₂, tipo K y más, según el riesgo de su inmueble</li>
          <li>Recarga y mantenimiento con evidencia para inspección</li>
          <li>Señalamientos, gabinetes, botiquines y equipo de protección</li>
          <li>Primera visita de revisión sin costo</li>
        </ul>
        <h2>¿Cómo cotizar en ${escapeHtml(zona.name)}?</h2>
        <p>Indique ${type.toLowerCase()}, giro y si ya tiene extintores vencidos. Le respondemos el mismo día hábil por WhatsApp o teléfono.</p>
        <p class="zona-page__cta">
          <a class="btn btn-wa" href="${waHref(zona)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Cotizar en ${escapeHtml(zona.name)}</a>
          <a class="btn btn-ink" href="/contacto">Formulario de contacto</a>
          <a class="btn btn-ink" href="/productos">Catálogo de equipos</a>
        </p>
        <p class="muted">También puede ver <a href="/nosotros#servicios">servicios de protección civil</a>, la <a href="/galeria">galería de trabajos</a> o la guía de <a href="/blog/extintores-cdmx">extintores en CDMX y Estado de México</a>.</p>
        <h2>${nearbyTitle}</h2>
        <ul class="zona-nearby">
            ${nearbyLinks(zona)}
            <li><a href="/zonas">Mapa completo de cobertura</a></li>
        </ul>
      </div>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical: `${SITE.origin}/zonas/${zona.slug}`,
    bodyAttrs: `data-page="zona" data-zona="${zona.slug}"`,
    main,
  });
}

mkdirSync(outDir, { recursive: true });
const keep = new Set(["index.html", ...zonas.map((z) => `${z.slug}.html`)]);
for (const name of readdirSync(outDir)) {
  if (name.endsWith(".html") && !keep.has(name)) unlinkSync(join(outDir, name));
}
writeFileSync(join(outDir, "index.html"), hubHtml());
for (const zona of zonas) {
  writeFileSync(join(outDir, `${zona.slug}.html`), zonaHtml(zona));
}
console.log(`zonas: hub + ${zonasCdmx.length} CDMX + ${zonasEdomex.length} Edo. Mex`);
