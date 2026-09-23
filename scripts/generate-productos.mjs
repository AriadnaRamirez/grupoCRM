/**
 * Static product and category HTML so crawlers see unique title, H1, canonical and schema.
 * Usage: node scripts/generate-productos.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  products,
  categories,
  company,
  SITE,
  catName,
  catSeo,
  catPath,
  catSeoTitle,
  productBySku,
  productPath,
  productSeoTitle,
  productMetaDescription,
  productAlt,
  productImg,
  relatedProducts,
} from "../js/data.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = "rb-13";

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatDateEs(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return `${d} de ${MONTHS_ES[m - 1]} de ${y}`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function waHref(text) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

function abs(path) {
  if (!path) return SITE.origin;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function contentDatesHtml() {
  return `<p class="content-dates content-dates--page">
          <span>Publicado el <time datetime="${SITE.contentPublished}">${formatDateEs(SITE.contentPublished)}</time></span>
          <span class="content-dates__sep" aria-hidden="true">·</span>
          <span>Actualizado el <time datetime="${SITE.contentModified}">${formatDateEs(SITE.contentModified)}</time></span>
        </p>`;
}

function pageShell({ title, description, canonical, bodyAttrs, main, jsonLd = "", ogType = "website", image, imageAlt, imageW = "1200", imageH = "630", imageType = "image/jpeg", robots = "index, follow" }) {
  const ogImage = abs(image || SITE.ogImage);
  return `<!DOCTYPE html>
<html lang="es-MX" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <style id="css-boot">
  :root { --chrome-h: 108px; }
  @media (min-width: 1024px) { :root { --chrome-h: 113px; } }
  html { background: #fff; }
  body { margin: 0; color: #202020; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  .bot-nav {
    position: absolute !important; width: 1px !important; height: 1px !important;
    padding: 0 !important; margin: -1px !important; overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important; clip-path: inset(50%) !important;
    white-space: nowrap !important; border: 0 !important;
  }
  .site-chrome { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: #fff; }
  .header-skel { height: var(--chrome-h); max-height: var(--chrome-h); overflow: hidden; pointer-events: none; }
  .header-skel .brand { pointer-events: auto; }
  .header-skel .nav, .header-skel .header__cta { display: none !important; }
  body:has([data-header]:empty),
  body:has([data-header] .header-skel),
  body:has([data-header] .site-chrome) {
    padding-top: calc(var(--chrome-h) + env(safe-area-inset-top, 0px));
  }
  .brand img { display: block; width: auto; height: auto; max-height: 47px; aspect-ratio: 720 / 154; object-fit: contain; }
  </style>
  <link rel="stylesheet" href="/css/main.min.css?v=${CACHE}">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <meta name="theme-color" content="${SITE.themeColor}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="${escapeHtml(company.shortName)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt || `Grupo CRM Extintores en CDMX y Estado de México`)}">
  <meta property="og:image:width" content="${imageW}">
  <meta property="og:image:height" content="${imageH}">
  <meta property="og:image:type" content="${imageType}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/img/favicon.png">
  <script>
  (function () {
    function loadFa() {
      if (document.getElementById("fa-css")) return;
      var link = document.createElement("link");
      link.id = "fa-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
      link.crossOrigin = "anonymous";
      link.referrerPolicy = "no-referrer";
      document.head.appendChild(link);
    }
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadFa, { timeout: 6000 });
    else window.addEventListener("load", function () { setTimeout(loadFa, 2500); }, { once: true });
  })();
  </script>
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>
${jsonLd}
</head>
<body ${bodyAttrs}>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <nav class="bot-nav" aria-label="Enlaces del sitio">
    <a href="/">Inicio</a>
    <a href="/productos">Productos</a>
    <a href="/nosotros">Nosotros</a>
    <a href="/venta-extintores">Venta de extintores</a>
    <a href="/recarga-extintores">Recarga</a>
    <a href="/mantenimiento-extintores">Mantenimiento</a>
    <a href="/instalacion-extintores">Instalación</a>
    <a href="/senalizacion">Señalización</a>
    <a href="/galeria">Galería</a>
    <a href="/blog">Blog</a>
    <a href="/contacto">Contacto</a>
    <a href="/extintores-cdmx">Extintores CDMX</a>
    <a href="/extintores-cuajimalpa">Cuajimalpa</a>
    <a href="/mapa-sitio">Mapa de sitio</a>
    <a href="tel:5667481489">56 6748 1489</a>
  </nav>
  <div data-header>
    <div class="site-chrome header-skel" aria-hidden="true">
      <div class="site-topbar"><div class="wrap topbar__inner"></div></div>
      <header class="site-header">
        <div class="wrap header__inner">
          <a class="brand" href="/"><picture><source type="image/webp" srcset="/assets/img/logo-crm.webp"><img src="/assets/img/logo-crm.png" alt="${escapeHtml(company.name)}" width="720" height="154" decoding="async"></picture></a>
          <span class="header-skel__nav" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>
          <span class="header-skel__cta" aria-hidden="true"></span>
        </div>
      </header>
    </div>
  </div>
  <main id="contenido">
${main}
  </main>
  <div data-footer></div>
  <script type="module" src="/js/app.min.js?v=${CACHE}" onerror="document.documentElement.classList.add('is-boot-error','is-booted')"></script>
</body>
</html>
`;
}

function globalLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE.origin}/#organization`,
      name: company.name,
      alternateName: ["Grupo CRM", "GRUPO CRM Extintores", "CRM Extintores"],
      url: SITE.origin,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE.origin}/#website`,
      name: company.shortName,
      url: SITE.origin,
      publisher: { "@id": `${SITE.origin}/#organization` },
    },
  ];
}

function ldScripts(nodes) {
  return nodes.map((n) => `  <script type="application/ld+json">${JSON.stringify(n)}</script>`).join("\n");
}

function productFaqs(p) {
  const name = p.title;
  return [
    {
      q: `¿Para qué sirve ${name}?`,
      a: `${p.use || p.desc} Lo cotizamos e instalamos en CDMX y Estado de México desde la oficina de Cuajimalpa.`,
    },
    {
      q: "¿El precio incluye instalación?",
      a: "La ficha es de equipo. La cotización puede incluir solo el artículo, o venta con instalación y señalamientos según su inmueble. Confirmamos el alcance por escrito.",
    },
    {
      q: "¿Atienden recarga de este tipo de equipo?",
      a: p.cat === "extintores"
        ? `Sí. Recargamos y damos mantenimiento alineados a la NOM-154-SCFI-2005. Si ya tiene un ${name.toLowerCase()}, envíe fotos por WhatsApp para evaluar si conviene recargar o sustituir.`
        : "Este artículo se cotiza como venta. Si necesita recarga o mantenimiento de extintores, vea el servicio de recarga.",
    },
  ];
}

function productHtml(p) {
  const path = productPath(p.sku);
  const canonical = abs(path);
  const title = productSeoTitle(p);
  const description = productMetaDescription(p);
  const cat = catName(p.cat);
  const classLine = (p.classes || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .join(" · ");
  const specs = [
    ["Clave", p.sku],
    ["Línea", cat],
    ["Capacidad / medidas", p.cap],
    ["Agente / material", p.agent],
    ["Clases de fuego", p.classes],
  ].filter(([, v]) => v);
  const related = relatedProducts(p.sku);
  const faqs = productFaqs(p);
  const imgWebp = `/assets/img/opt/catalog/${p.sku}-800.webp`;
  const imgPng = productImg(p);
  const alt = productAlt(p, { detail: true });
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: abs("/productos") },
      { "@type": "ListItem", position: 3, name: cat, item: abs(catPath(p.cat)) },
      { "@type": "ListItem", position: 4, name: p.title, item: canonical },
    ],
  };
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: p.sku,
    description: `${p.desc} ${p.use}`.trim(),
    image: {
      "@type": "ImageObject",
      url: abs(imgWebp),
      contentUrl: abs(imgPng),
      name: alt,
      caption: alt,
    },
    brand: { "@type": "Brand", name: company.shortName, alternateName: [company.name, "GRUPO CRM Extintores"] },
    category: cat,
    url: canonical,
    offers: {
      "@type": "Offer",
      url: canonical,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceCurrency: "MXN",
      seller: { "@id": `${SITE.origin}/#business` },
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const relatedHtml = related
    .map(
      (r) => `<li>
              <a href="${productPath(r.sku)}">
                <strong>${escapeHtml(r.title)}</strong>
                <span>${escapeHtml(r.sku)}${r.cap ? ` · ${escapeHtml(r.cap)}` : ""}</span>
              </a>
            </li>`
    )
    .join("\n            ");
  const faqHtml = faqs
    .map(
      (f) => `<details class="svc">
          <summary class="svc__sum">${escapeHtml(f.q)}</summary>
          <div class="svc__text"><p>${escapeHtml(f.a)}</p></div>
        </details>`
    )
    .join("\n        ");
  const serviceLink =
    p.cat === "extintores"
      ? `<p>También puede pedir <a href="/venta-extintores">venta</a>, <a href="/recarga-extintores">recarga</a> o <a href="/instalacion-extintores">instalación</a> en CDMX y Estado de México.</p>`
      : `<p>Vea el <a href="/productos">catálogo</a> o pida <a href="/venta-extintores">venta e instalación</a>.</p>`;

  const main = `  <div data-product aria-busy="false">
    <div class="wrap ficha-wrap">
      <p class="ficha-crumb"><a href="/productos">Catálogo</a> · <a href="${catPath(p.cat)}">${escapeHtml(cat)}</a></p>
      <article class="ficha" data-cat="${p.cat}" data-sku="${p.sku}">
        <div class="ficha__grid">
          <figure class="ficha__photo">
            <picture>
              <source type="image/webp" srcset="${imgWebp}" sizes="(min-width: 900px) 420px, 90vw">
              <img src="${imgPng}" alt="${escapeHtml(alt)}" width="800" height="800" decoding="async" fetchpriority="high">
            </picture>
          </figure>
          <div class="ficha__copy">
            <p class="kicker">${escapeHtml(cat)}</p>
            <p class="ficha__sku">${p.sku}</p>
            <h1>${escapeHtml(p.title)}</h1>
            ${classLine ? `<p class="ficha__class">Clase ${escapeHtml(classLine)}</p>` : ""}
            ${contentDatesHtml()}
            <h2 class="ficha__h">Descripción</h2>
            <p class="ficha__desc">${escapeHtml(p.desc)}</p>
            <div class="ficha__use">
              <h2>Uso recomendado</h2>
              <p>${escapeHtml(p.use)}</p>
            </div>
            <table class="specs">${specs.map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</table>
            <p>Servicio en CDMX y Estado de México, coordinado desde la oficina de Cuajimalpa. El precio se confirma por escrito según cantidad, instalación y señalamientos.</p>
            ${serviceLink}
            <div class="actions">
              <a class="btn btn-wa" href="${waHref(`Hola, quiero cotizar ${p.sku} — ${p.title}`)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Cotizar por WhatsApp</span></a>
              <a class="btn btn-ink" href="tel:${company.phoneTel}" aria-label="Llámenos al ${company.phone}"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Llámenos</span></a>
            </div>
          </div>
        </div>
      </article>
      <h2>Preguntas frecuentes</h2>
      <div class="svc-list">
        ${faqHtml}
      </div>
      ${
        relatedHtml
          ? `<section class="section shop-related">
        <h2>Esto también le puede servir</h2>
        <ul class="zona-nearby">
            ${relatedHtml}
        </ul>
      </section>`
          : ""
      }
    </div>
  </div>`;

  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: `data-page="producto" data-sku="${p.sku}"`,
    main,
    ogType: "product",
    image: imgWebp,
    imageAlt: alt,
    imageW: "800",
    imageH: "800",
    imageType: "image/webp",
    jsonLd: ldScripts([...globalLd(), crumbs, productLd, faqLd]),
  });
}

const CAT_LEAD = {
  extintores:
    "PQS ABC, CO₂, tipo K, agente limpio y unidades móviles para empresas en CDMX y Estado de México. Si no está seguro del tipo, le orientamos según el riesgo de su inmueble.",
  chalecos: "Chalecos de malla, reflejante y gabardina para identificar a su brigada en simulacros y emergencias.",
  "senalamiento-vial": "Conos, cintas, postes y señales para obra, estacionamiento y vialidad.",
  "gabinetes-herrajes": "Gabinetes, portaextintores, mangueras y herrajes para dejar el punto de incendio listo.",
  botiquines: "Botiquines metálicos de pared en tres tamaños para oficinas, escuelas y comercios.",
  "equipo-proteccion": "Detectores, lámparas, cascos, guantes y equipo de rescate para su personal.",
};

function categoryHtml(cat) {
  const list = products.filter((p) => p.cat === cat.id);
  const path = catPath(cat.id);
  const canonical = abs(path);
  const title = catSeoTitle(cat.id);
  const description = catSeo[cat.id] || `Línea de ${cat.name.toLowerCase()} de Grupo CRM. Cotice en CDMX y Estado de México.`;
  const cards = list
    .map(
      (p) => `<article class="shop-item">
              <a class="shop-item__link" href="${productPath(p.sku)}">
                <span class="shop-item__media">
                  <picture>
                    <source type="image/webp" srcset="/assets/img/opt/catalog/${p.sku}-800.webp">
                    <img src="${productImg(p)}" alt="${escapeHtml(productAlt(p))}" width="400" height="400" loading="lazy" decoding="async">
                  </picture>
                </span>
                <span class="shop-item__body">
                  <span class="shop-item__sku">${p.sku}</span>
                  <h2 class="shop-item__title">${escapeHtml(p.title)}</h2>
                  <span class="shop-item__meta">${escapeHtml([p.cap, p.agent].filter(Boolean).join(" · "))}</span>
                </span>
              </a>
            </article>`
    )
    .join("\n            ");
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: abs("/productos") },
      { "@type": "ListItem", position: 3, name: cat.name, item: canonical },
    ],
  };
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.name,
    url: canonical,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: abs(productPath(p.sku)),
    })),
  };
  const main = `  <section class="section zona-page">
    <div class="wrap">
      <nav class="article-crumb" aria-label="Miga de pan">
        <a href="/">Inicio</a> · <a href="/productos">Catálogo</a> · ${escapeHtml(cat.name)}
      </nav>
      <p class="kicker">Catálogo</p>
      <h1>${escapeHtml(cat.name)}</h1>
      <hr class="rule rule-left" aria-hidden="true">
      <p class="lead">${escapeHtml(CAT_LEAD[cat.id] || description)}</p>
      ${contentDatesHtml()}
      <p>Cotice venta e instalación en CDMX y Estado de México. WhatsApp <a href="tel:${company.phoneTel}">${escapeHtml(company.phone)}</a>.</p>
    </div>
  </section>
  <section class="shop">
    <div class="wrap wrap-shop">
      <div class="shop-grid shop-grid--4" data-products aria-busy="false">
            ${cards}
      </div>
    </div>
  </section>`;

  return pageShell({
    title,
    description,
    canonical,
    bodyAttrs: `data-page="productos" data-cat="${cat.id}"`,
    main,
    jsonLd: ldScripts([...globalLd(), crumbs, itemList]),
  });
}

mkdirSync(join(root, "producto"), { recursive: true });
mkdirSync(join(root, "productos"), { recursive: true });

for (const p of products) {
  writeFileSync(join(root, "producto", `${p.sku}.html`), productHtml(p));
}

for (const cat of categories) {
  writeFileSync(join(root, "productos", `${cat.id}.html`), categoryHtml(cat));
}

console.log(`wrote ${products.length} product pages and ${categories.length} category pages`);
