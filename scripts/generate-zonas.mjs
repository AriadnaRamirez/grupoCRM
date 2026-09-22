import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { zonasCdmx, company } from "../js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "zonas");
const pagesBase = readFileSync(join(root, "js", "pages-base.js"), "utf8").trim();
const pagesBaseSnippet = `  <script>\n  /* pages-base */\n${pagesBase
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}\n  </script>\n`;
const cssBoot = `  <style id="css-boot">
  /* css-boot: hide until local CSS + header are ready */
  html:not(.is-booted) { visibility: hidden; background: #fff; }
  </style>
  <noscript><style>html { visibility: visible !important; }</style></noscript>
  <script>setTimeout(function () { document.documentElement.classList.add("is-booted"); }, 4000);</script>
`;

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function waHref(zona) {
  const text = `Hola, quiero cotizar extintores y equipo contra incendios en ${zona.name}, CDMX.`;
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

function nearbyLinks(zona) {
  return zona.nearby
    .map((slug) => {
      const n = zonasCdmx.find((z) => z.slug === slug);
      if (!n) return "";
      return `<li><a href="/zonas/${n.slug}">CRM Extintores en ${escapeHtml(n.name)}</a></li>`;
    })
    .filter(Boolean)
    .join("\n            ");
}

function pageShell({ title, description, canonical, bodyAttrs, main }) {
  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
${pagesBaseSnippet}${cssBoot}
  <link rel="stylesheet" href="/css/tokens.css?v=prod-20260903">
  <link rel="stylesheet" href="/css/main.css?v=topbar-zonas">
  <script>document.documentElement.classList.add("is-css");</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="es-MX" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="Grupo CRM Extintores">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://www.crmextintores.com/assets/img/logo-crm.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="icon" href="/assets/img/logo-crm-flame.png" type="image/png">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
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
  <script type="module" src="/js/main.js?v=topbar-zonas" onerror="document.documentElement.classList.add('is-boot-error','is-booted')"></script>
</body>
</html>
`;
}

function hubHtml() {
  const list = zonasCdmx
    .map(
      (z) =>
        `<li><a href="/zonas/${z.slug}"><strong>CRM Extintores en ${escapeHtml(z.name)}</strong><span>Venta, recarga e instalación de extintores</span></a></li>`
    )
    .join("\n          ");
  const title = "Extintores en CDMX por alcaldía | Grupo CRM Extintores";
  const description =
    "Venta, recarga e instalación de extintores en las 16 alcaldías de la Ciudad de México. Cotice con Grupo CRM Extintores.";
  const main = `  <section class="section zona-page">
    <div class="wrap">
      <p class="kicker">Cobertura CDMX</p>
      <h1>CRM Extintores en la Ciudad de México</h1>
      <hr class="rule rule-left" aria-hidden="true">
      <p class="lead">Atendemos las 16 alcaldías con venta, recarga, instalación y revisión de extintores. Elija su alcaldía para ver cobertura local y cotizar.</p>
      <ul class="zona-grid">
          ${list}
      </ul>
      <p class="zona-page__cta">
        <a class="btn btn-wa" href="https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hola, quiero cotizar extintores en CDMX.")}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Cotizar por WhatsApp</a>
        <a class="btn btn-ink" href="/contacto">Pedir cotización en contacto</a>
      </p>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical: "https://www.crmextintores.com/zonas",
    bodyAttrs: 'data-page="zonas"',
    main,
  });
}

function zonaHtml(zona) {
  const title = `CRM Extintores en ${zona.name} | Grupo CRM Extintores`;
  const description = `Venta, recarga e instalación de extintores en ${zona.name}, CDMX. Primera visita sin costo. Cotice con Grupo CRM Extintores.`;
  const nearby = nearbyLinks(zona);
  const main = `  <section class="section zona-page">
    <div class="wrap zona-page__layout">
      <header class="zona-page__head">
        <p class="article-crumb"><a href="/">Inicio</a> · <a href="/zonas">Cobertura CDMX</a> · ${escapeHtml(zona.name)}</p>
        <p class="kicker">Alcaldía ${escapeHtml(zona.name)}</p>
        <h1>CRM Extintores en ${escapeHtml(zona.name)}</h1>
        <hr class="rule rule-left" aria-hidden="true">
        <p class="lead">Venta, recarga e instalación de extintores y equipo contra incendios en ${escapeHtml(zona.name)}, Ciudad de México. Atendemos ${escapeHtml(zona.focus)}.</p>
      </header>
      <div class="zona-page__body">
        <h2>Servicio local en ${escapeHtml(zona.name)}</h2>
        <p>Grupo CRM Extintores opera desde Cuajimalpa y se desplaza a ${escapeHtml(zona.name)} para dejar su empresa, condominio u oficina lista ante Protección Civil. Cotizamos equipos certificados, recarga bajo NOM-154-SCFI-2005 e instalación en sitio.</p>
        <ul class="zona-page__points">
          <li>Extintores PQS, CO₂, tipo K y más, según el riesgo de su inmueble</li>
          <li>Recarga y mantenimiento con evidencia para inspección</li>
          <li>Señalamientos, gabinetes, botiquines y equipo de protección</li>
          <li>Primera visita de revisión sin costo</li>
        </ul>
        <h2>¿Cómo cotizar en ${escapeHtml(zona.name)}?</h2>
        <p>Indique alcaldía, giro y si ya tiene extintores vencidos. Le respondemos el mismo día hábil por WhatsApp o teléfono.</p>
        <p class="zona-page__cta">
          <a class="btn btn-wa" href="${waHref(zona)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Cotizar en ${escapeHtml(zona.name)}</a>
          <a class="btn btn-ink" href="/contacto">Ir a contacto</a>
          <a class="btn btn-ghost" href="/productos">Ver catálogo de extintores</a>
        </p>
        <h2>Otras alcaldías cercanas</h2>
        <ul class="zona-nearby">
            ${nearby}
            <li><a href="/zonas">Ver todas las alcaldías de CDMX</a></li>
        </ul>
        <p class="muted">También puede leer nuestra guía de <a href="/blog/extintores-cdmx">extintores en CDMX y Estado de México</a>.</p>
      </div>
    </div>
  </section>`;
  return pageShell({
    title,
    description,
    canonical: `https://www.crmextintores.com/zonas/${zona.slug}`,
    bodyAttrs: `data-page="zona" data-zona="${zona.slug}"`,
    main,
  });
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), hubHtml());
for (const zona of zonasCdmx) {
  writeFileSync(join(outDir, `${zona.slug}.html`), zonaHtml(zona));
}
console.log(`zonas: hub + ${zonasCdmx.length} alcaldías`);
